import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotesService } from './notes.service';
import { AllNotes, Response } from './model/noteModel';
import { CreateNoteInput } from './dto/create-note.input';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/auth/models/login-user-model';

@Resolver()
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Query(() => AllNotes)
  @UseGuards(JwtGuard)
  async getAllNotes(
    @GetUser() user: User,
    @Args('getImportant', { nullable: true }) input?: boolean,
  ) {
    return this.notesService.getAllNotes(user, input);
  }

  @Mutation(() => Response)
  @UseGuards(JwtGuard)
  async AddNote(@GetUser() user: User, @Args() input: CreateNoteInput) {
    return this.notesService.addNote(input, user);
  }

  @Mutation(() => Response)
  @UseGuards(JwtGuard)
  async deleteNote(@GetUser() user: User, @Args('noteId') noteId: string) {
    return this.notesService.deleteNote(noteId, user);
  }

  @Mutation(() => Response)
  @UseGuards(JwtGuard)
  async switchIsImportant(
    @GetUser() user: User,
    @Args('noteId') noteId: string,
  ) {
    return this.notesService.switchIsImportant(noteId, user);
  }
}
