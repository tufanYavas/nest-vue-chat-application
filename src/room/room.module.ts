import { Module, forwardRef } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { EventsModule } from '../events/events.module';

@Module({
	controllers: [RoomController],
	providers: [RoomService],
	exports: [RoomService],
	imports: [forwardRef(() => EventsModule), TypeOrmModule.forFeature([Room])],
})
export class RoomModule {}
