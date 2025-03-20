import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
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
  metadata: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsString()
  price: string;
}
