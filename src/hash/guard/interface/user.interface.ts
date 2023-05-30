export enum UserType {
  User = 'user',
}

export enum Level {
  Player = 'player',
  Admin = 'admin',
}

export interface User {
  id: string;
  user_type: UserType;
  level: Level;
}
