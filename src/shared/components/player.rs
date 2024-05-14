




#[derive(Clone, Debug, Default, Component)]
pub struct Status {
    pub level: u32,
    pub levelbar: f32,
    pub score: u32,
    pub scorebar: f32,
    pub classname: String,
}

#[derive(Clone, Debug, Default)]
struct Stat {
    pub name: String,
    pub value: String,
}

#[derive(Clone, Debug, Default, Component)]
pub struct Stats(Vec<Stat>); // Death Stats

#[derive(Clone, Debug, Default, Component)]
pub struct AvailableClasses(Vec<u16>); // Available Tank Upgrades


