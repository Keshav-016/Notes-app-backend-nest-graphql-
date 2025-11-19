import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteInput } from './dto/create-note.input';
import { User } from 'src/auth/models/login-user-model';
import CustomError from 'src/filters/custom-error-filter';
import { StatusCodes } from 'src/enum/status-codes.enum';

@Injectable()
export class NotesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllNotes(user: User, getImportant: boolean) {
    try {
      const notes = await this.prismaService.notes.findMany({
        where: {
          userId: user.id,
          ...(getImportant ? { isImportant: true } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });
      return { data: notes, message: 'All notes', success: true };
    } catch (error) {
      throw error;
    }
  }

  async deleteNote(noteId: string, user: User) {
    try {
      await this.prismaService.notes.delete({
        where: { userId: user.id, id: noteId },
      });
      return { message: 'Note deleted successfully', success: true };
    } catch (error) {
      throw error;
    }
  }

  async addNote(input: CreateNoteInput, user: User) {
    try {
      await this.prismaService.notes.createMany({
        data: input.notes.map((note) => ({
          title: note.title,
          description: note.description,
          userId: user.id,
          createdAt: isNaN(new Date(note.createdAt).getTime())
            ? new Date()
            : new Date(note.createdAt),

          isImportant: note.isImportant || false,
        })),
      });
      return { message: 'Note created successfully', success: true };
    } catch (error) {
      throw error;
    }
  }
  async switchIsImportant(noteId: string, user: User) {
    try {
      const noteExistence = await this.prismaService.notes.findUnique({
        where: { userId: user.id, id: noteId },
      });
      if (!noteExistence) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'Note not found');
      }
      await this.prismaService.notes.update({
        where: { userId: user.id, id: noteId },
        data: { isImportant: !noteExistence.isImportant },
      });
      return { message: 'updated the note', success: true };
    } catch (error) {
      throw error;
    }
  }
}
