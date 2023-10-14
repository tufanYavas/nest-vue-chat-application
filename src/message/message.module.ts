import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from 'src/room/room.module';

@Module({
	controllers: [MessageController],
	providers: [MessageService],
	exports: [MessageService],
	imports: [TypeOrmModule.forFeature([Message]), RoomModule],
})
export class MessageModule {}
