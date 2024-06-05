use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Default, PartialEq, PartialOrd, Eq, Ord)]
pub enum Actions {
    #[default]
    Suicide,
    Godmode,
    Spawn(String),
    SetClass(u32),
    SetAttribute(u8, u32),
}

#[derive(Clone, Serialize, Default, Deserialize, PartialEq)]
pub struct ConsoleCommand {
    pub id: CommandId,
    pub name: String,
    pub description: String,
    pub usage: String,
}

pub type CommandId = u16;