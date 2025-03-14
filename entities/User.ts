import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({
    type: "varchar",
    length: 255,
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  first_name!: string;

  @Column({
    type: "varchar",
    length: 255,
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  last_name!: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  reset_password_token?: string | null;
}
