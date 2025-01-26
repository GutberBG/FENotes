import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../notes.service';
import { AuthService } from 'src/app/core/auth.service';
import { TagsService } from '../../tags/tags.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes: any[] = [];
  filteredNotes: any[] = [];
  tags: any[] = [];
  userId: number = 0;
  archived: boolean = false; 
  selectedNote: any = null;
  selectedSection: string | null = null;
  selectedTag: any | null = null;

  constructor(private notesService: NotesService, private authService: AuthService, private tagsService: TagsService) { }

  ngOnInit(): void {
    console.log('NotesComponent initialized');

    
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.userId = parsedUser.userId;
      console.log('User ID from localStorage:', this.userId);
    }

    
    this.authService.getCurrentUser().subscribe((user) => {
      if (user && this.userId !== null) {
        this.loadNotes(false);
        this.loadTags();
      }
    });
  }

  loadNotes(archived: boolean): void {
    this.selectedSection = archived ? 'archived' : 'all';
    this.selectedTag = null;
    this.archived = archived; // Establece el estado de archivado
    const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).token : '';
    console.log('Token: ' + token);

    this.notesService.getNotesByUserAndArchived(this.userId, this.archived, token).subscribe((data: any) => {
      this.notes = data;
      this.filteredNotes = data;
    });
  }

  loadArchivedNotes(): void {
    this.notesService.getUserArchivedNotes(this.userId, this.archived).subscribe((data: any) => {
      this.notes = data;
      this.filteredNotes = data;
    });
  }

  toggleArchived(): void {
    this.archived = !this.archived;
    this.loadArchivedNotes();
  }

  selectNote(note: any): void {
    this.selectedNote = note;
  }

  loadTags(): void {
    const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).token : '';
    if (token) {
      this.tagsService.getTagsByUser(this.userId, token).subscribe(
        (tags) => {
          this.tags = tags;
        },
        (error) => {
          console.error('Error fetching tags:', error);
        }
      );
    }
  }

  filterNotesByTag(tag: any): void {
    this.selectedTag = tag;
    console.log('Filtering notes by tag:', tag);
    if (tag) {
      console.log('Filtering notes by tag:', tag);
      console.log('Tag notes:', this.notes.filter(note => tag.notes.includes(note.id)));
      this.filteredNotes = this.notes.filter(note => tag.notes.includes(note.id));
    } else {
      this.filteredNotes = this.notes;
    }
  }
}