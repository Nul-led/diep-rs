use std::marker::PhantomData;

use bevy::prelude::Component;
use serde::{Deserialize, Serialize};

use crate::shared::util::shape::ColliderTrace;

use super::{object::Health, physics::{ImpactDeflection, ImpactPotency, ImpactResistance, LinearVelocity}};

pub trait Animatable {
    /// Animation function, will animate this struct according to the current time (0.0 .. 1.0)
    fn animate(&mut self, step: f32);
}

#[derive(Component, Clone, Copy, Serialize, Deserialize)]
pub struct Animation<T: Animatable> {
    _phantom: PhantomData<T>,
    /// The total frame count
    pub frames: u32,
    /// The current frame
    pub frame: u32,
    /// This should be 1 by default (aka the animated value remains the same)
    pub step_factor: f32,
}

impl<T: Animatable> Default for Animation<T> {
    fn default() -> Self {
        Self {
            _phantom: PhantomData,
            frames: 1,
            frame: 0,
            step_factor: 1.0
        }
    }
}

impl<T: Animatable> Animation<T> {
    pub fn new(total_frames: u32, step: f32) -> Self {
        Self {
            _phantom: PhantomData,
            frames: total_frames,
            frame: 0,
            step_factor: step
        }
    }

    pub fn finished(&self) -> bool {
        self.frame == self.frames
    }

    pub fn step(&mut self, animatable: &mut T) {
        assert!(!self.finished(), "Animation finished, but continued running");
        self.frame += 1;
        animatable.animate(self.step_factor);
    }
}

impl Animatable for ColliderTrace {
    fn animate(&mut self, step: f32) {
        self.scale_by(step);
    }
}

impl Animatable for Health {
    fn animate(&mut self, step: f32) {
        self.health *= step;
    }
}