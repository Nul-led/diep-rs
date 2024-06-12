use std::f32::consts::{PI, TAU};

use bevy::math::{primitives::{BoxedPolygon, BoxedPolyline2d, Capsule2d, Circle, Line2d, Plane2d, Polygon, Polyline2d, Primitive2d, Rectangle, RegularPolygon, Segment2d, Triangle2d}, Vec2};
use parry2d::{math::{Point, Real}, shape::SharedShape};

use crate::shared::components::physics::Collider;

use super::shape::{IsoscelesTrapezoid, RegularStar};

impl From<Circle> for Collider {
    fn from(value: Circle) -> Self {
        Self(SharedShape::ball(value.radius))
    }
}

impl From<Plane2d> for Collider {
    fn from(value: Plane2d) -> Self {
        let vec = value.normal.perp() * 100_000.0 / 2.0;
        Self(SharedShape::segment(-Point::from(vec), vec.into()))
    }
}

impl From<Line2d> for Collider {
    fn from(value: Line2d) -> Self {
        let vec = *value.direction * 100_000.0 / 2.0;
        Self(SharedShape::segment(-Point::from(vec), vec.into()))
    }
}

impl From<Segment2d> for Collider {
    fn from(value: Segment2d) -> Self {
        let (point1, point2) = (value.point1(), value.point2());
        Self(SharedShape::segment(point1.into(), point2.into()))
    }
}

impl<const N: usize> From<Polyline2d<N>> for Collider {
    fn from(value: Polyline2d<N>) -> Self {
        let vertices = value.vertices.into_iter().map(|v| v.into()).collect();
        Self(SharedShape::polyline(vertices, None))
    }
}

impl From<&BoxedPolyline2d> for Collider {
    fn from(value: &BoxedPolyline2d) -> Self {
        let vertices = value.vertices.iter().map(|v| (*v).into()).collect();
        Self(SharedShape::polyline(vertices, None))
    }
}

impl From<Triangle2d> for Collider {
    fn from(value: Triangle2d) -> Self {
        Self(SharedShape::triangle(value.vertices[0].into(), value.vertices[1].into(), value.vertices[2].into()))
    }
}

impl From<Rectangle> for Collider {
    fn from(value: Rectangle) -> Self {
        Collider(SharedShape::cuboid(value.half_size.x, value.half_size.y))
    }
}

impl<const N: usize> From<Polygon<N>> for Collider {
    fn from(value: Polygon<N>) -> Self {
        let vertices: Vec<Point<Real>> = value.vertices.into_iter().map(|v| v.into()).collect();
        let indices: Vec<[u32; 2]> = (0..N as u32 - 1).map(|i| [i, i + 1]).collect();
        Self(SharedShape::convex_decomposition(&vertices, &indices))
    }
}

impl From<&BoxedPolygon> for Collider {
    fn from(value: &BoxedPolygon) -> Self {
        let vertices: Vec<Point<Real>> = value.vertices.iter().map(|v| (*v).into()).collect();
        let indices: Vec<[u32; 2]> = (0..value.vertices.len() as u32 - 1).map(|i| [i, i + 1]).collect();
        Self(SharedShape::convex_decomposition(&vertices, &indices))
    }
}

impl From<RegularPolygon> for Collider {
    fn from(value: RegularPolygon) -> Self {
        let vertices: Vec<Point<Real>> = value.vertices(0.0).into_iter().map(|v| v.into()).collect();
        Self(SharedShape::convex_hull(&vertices).unwrap())
    }
}

impl From<Capsule2d> for Collider {
    fn from(value: Capsule2d) -> Self {
        Self(SharedShape::capsule(
            (Vec2::Y * value.half_length).into(),
            (Vec2::NEG_Y * value.half_length).into(),
            value.radius
        ))
    }
}

impl From<IsoscelesTrapezoid> for Collider {
    fn from(value: IsoscelesTrapezoid) -> Self {
        let vertices: Vec<Point<Real>> = vec![
            Point::new(-value.half_size.x, -value.half_size.y),
            Point::new(value.half_size.x, -value.half_size.y * value.asymmetry),
            Point::new(value.half_size.x, value.half_size.y * value.asymmetry),
            Point::new(-value.half_size.x, value.half_size.y),
        ];
        Self(SharedShape::convex_hull(&vertices).unwrap())
    }
}

impl From<RegularStar> for Collider {
    fn from(value: RegularStar) -> Self {
        Self::from(value.regular_polygon)
    }
}


/*
Ball: Circle
Cuboid: Rect
Halfspace: ?
Segment: Line
Capsule: Round rect
Triangle: Lines from vertex to vertex
Compound: Compound.shapes() -> x: Shape
    transform(x.isometry)
    render(x.shape)
    transform(x.isometry.inv())
Trimesh: Trimesh.triangles() -> x: Triangle
    render(x)
Polyline: Polyline.segments() -> x: Segment
    render(x)
Heightfield: ?
Round Cuboid: Round rect
Round Triangle: Roundedpoly
Convex Polygon: ConvexPolygon.points -> x: Point
    lineTo(point
RoundConvexPolygon: rounded poly

*/


/* 

impl From<&Shape> for Collider {
    fn from(value: &Shape) -> Self {
        match value {
            Shape::RoundRect {
                radius,
                width,
                height,
            } => Collider::from(SharedShape::round_cuboid(*width, *height, *radius)),
            Shape::Parallelogram {
                width,
                height,
                offset,
            } => Collider::convex_hull(vec![
                Vec2::new(-width / 2.0, -height / 2.0),
                Vec2::new(width / 2.0, -height / 2.0),
                Vec2::new(width / 2.0 + offset, height / 2.0),
                Vec2::new(-width / 2.0 + offset, height / 2.0),
            ])
            .unwrap(),
            Shape::Kite { width, height } => Collider::convex_hull(vec![
                Vec2::new(0.0, -height / 2.0),
                Vec2::new(width / 2.0, 0.0),
                Vec2::new(0.0, height / 2.0),
                Vec2::new(-width / 2.0, 0.0),
            ])
            .unwrap(),
        }
    }
}



function roundedPoly(ctx, points, radiusAll) {
    var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut,radius;
    // convert 2 points into vector form, polar form, and normalised 
    var asVec = function(p, pp, v) {
      v.x = pp.x - p.x;
      v.y = pp.y - p.y;
      v.len = Math.sqrt(v.x * v.x + v.y * v.y);
      v.nx = v.x / v.len;
      v.ny = v.y / v.len;
      v.ang = Math.atan2(v.ny, v.nx);
    }
    radius = radiusAll;
    v1 = {};
    v2 = {};
    len = points.length;
    p1 = points[len - 1];
    // for each point
    for (i = 0; i < len; i++) {
      p2 = points[(i) % len];
      p3 = points[(i + 1) % len];
      //-----------------------------------------
      // Part 1
      asVec(p2, p1, v1);
      asVec(p2, p3, v2);
      sinA = v1.nx * v2.ny - v1.ny * v2.nx;
      sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
      angle = Math.asin(sinA < -1 ? -1 : sinA > 1 ? 1 : sinA);
      //-----------------------------------------
      radDirection = 1;
      drawDirection = false;
      if (sinA90 < 0) {
        if (angle < 0) {
          angle = Math.PI + angle;
        } else {
          angle = Math.PI - angle;
          radDirection = -1;
          drawDirection = true;
        }
      } else {
        if (angle > 0) {
          radDirection = -1;
          drawDirection = true;
        }
      }
      if(p2.radius !== undefined){
          radius = p2.radius;
      }else{
          radius = radiusAll;
      }
      //-----------------------------------------
      // Part 2
      halfAngle = angle / 2;
      //-----------------------------------------
  
      //-----------------------------------------
      // Part 3
      lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
      //-----------------------------------------
  
      //-----------------------------------------
      // Special part A
      if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
        lenOut = Math.min(v1.len / 2, v2.len / 2);
        cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
      } else {
        cRadius = radius;
      }
      //-----------------------------------------
      // Part 4
      x = p2.x + v2.nx * lenOut;
      y = p2.y + v2.ny * lenOut;
      //-----------------------------------------
      // Part 5
      x += -v2.ny * cRadius * radDirection;
      y += v2.nx * cRadius * radDirection;
      //-----------------------------------------
      // Part 6
      ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection);
      //-----------------------------------------
      p1 = p2;
      p2 = p3;
    }
    ctx.closePath();
  }

*/