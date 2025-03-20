import { HttpException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const existingServices = await this.servicesRepository.findOne({
      where: { name: createServiceDto.name },
    });
    if (
      existingServices.name.toLowerCase === createServiceDto.name.toLowerCase
    ) {
      throw new HttpException('Service name is already saved', 403);
    }
    const serviceData = await this.servicesRepository.create(createServiceDto);
    return this.servicesRepository.save(serviceData);
  }

  async findAll(): Promise<Services[]> {
    return this.servicesRepository.find();
  }

  async findOne(id: number): Promise<Services> {
    const serviceData = await this.servicesRepository.findOneBy({ id });
    if (!serviceData) {
      throw new HttpException('Services Not Found', 404);
    }
    return serviceData;
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Services> {
    const existingServices = await this.findOne(id);
    if (
      existingServices.name.toLowerCase === updateServiceDto.name.toLowerCase
    ) {
      throw new HttpException('Service name is already saved', 403);
    }
    const serviceData = this.servicesRepository.merge(
      existingServices,
      updateServiceDto,
    );
    return await this.servicesRepository.save(serviceData);
  }

  async remove(id: number) {
    const existingUser = await this.findOne(id);
    return await this.servicesRepository.remove(existingUser);
  }
}
