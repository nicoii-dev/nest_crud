import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Service name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Inclusion list is required' })
  @IsString()
  inclusion: string;

  @IsString()
  @IsOptional()
  metadata: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsString()
  price: string;
}
