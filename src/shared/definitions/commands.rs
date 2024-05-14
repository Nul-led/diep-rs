#[derive(Clone, Debug, Default, PartialEq, PartialOrd, Eq, Ord)]
pub enum Commands {
    #[default]
    Suicide,
    Godmode,
    Spawn(String),
    SetClass(u32),
    SetAttribute(u8, u32),
}