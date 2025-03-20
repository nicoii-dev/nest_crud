import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Services {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  inclusion: string;

  @Column()
  metadata: string;

  @Column()
  price: string;

  @Column({ default: true })
  isActive: boolean;
}
