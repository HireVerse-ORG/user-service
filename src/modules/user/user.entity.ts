import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    BaseEntity,
} from 'typeorm';
import { IsEmail, IsBoolean, IsEnum, Length } from 'class-validator';
import bcrypt from 'bcryptjs';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    COMPANY = 'company',
}

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    @Length(6, 20)
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    @IsEnum(UserRole)
    role!: UserRole;

    @Column({ default: false })
    @IsBoolean()
    isVerified!: boolean;

    @Column({ default: false })
    @IsBoolean()
    isBlocked!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

