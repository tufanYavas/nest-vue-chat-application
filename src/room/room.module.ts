import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';

@Module({
	controllers: [RoomController],
	providers: [RoomService],
	exports: [RoomService],
	imports: [TypeOrmModule.forFeature([Room])],
})
export class RoomModule {}
