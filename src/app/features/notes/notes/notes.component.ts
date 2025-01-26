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
  archived: boolean = false;
  selectedNote: any = null;
  selectedSection: string | null = null;
  selectedTag: any | null = null;
  isCreatingNote = false;
  token: string = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).token : '';
  toastMessage: string = 'Nota actualizada con éxito.';
  searchQuery: string = '';
  isDeleteModalOpen: boolean = false;
  userId: number = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).userId : 0;

  newNote = {
    id: 0,
    title: 'Title',
    content: 'Description',
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false,
    userId: this.userId,
    tags: ["no label"] as string[]
  };

  constructor(private notesService: NotesService, private authService: AuthService, private tagsService: TagsService) { }


  startCreatingNote() {
    this.isCreatingNote = true;
    this.newNote = {
      id: 0,
      title: 'Title',
      content: 'Description',
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
      userId: this.userId,
      tags: ["no label"]
    };
    this.selectedNote = this.newNote;
  }

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

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      // Si no hay término de búsqueda, cargar todas las notas
      this.loadNotes(false);
    } else {
      // Hacer una llamada al backend para buscar las notas
      this.notesService.searchNotes(this.userId, this.searchQuery).subscribe(
        (notes: any[]) => {
          this.filteredNotes = notes;
        },
        (error) => {
          console.error('Error al buscar notas:', error);
        }
      );
    }
  }


  cancelCreation() {
    this.isCreatingNote = false;
  }

  onTagsChange(event: any): void {
    const tagsInput = event.target.textContent || ''; // Asegúrate de que no sea undefined
    this.newNote.tags = tagsInput.split(',').map((tag: string) => tag.trim());
  }

  onTitleChange(event: any): void {
    this.newNote.title = event.target.innerText;
  }

  onContentChange(event: any): void {
    const target = event.target;
    this.newNote.content = target.innerHTML;
    
    requestAnimationFrame(() => {
      
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(target);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
   }

  showSuccessToast: boolean = false;
  
  // Método para mostrar el toast
  showToast(message: string) {
    this.toastMessage = message;
    this.showSuccessToast = true;

    
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000); 
  }
   
   closeToast() {
    this.showSuccessToast = false;
  }

  createNote() {
    if (this.isCreatingNote) {
      console.log('Creating note:', this.newNote);
      this.notesService.createNote(this.newNote, this.token).subscribe(
        (response) => {
          console.log('Nota creada:', response);
          this.loadNotes(false);
          this.showToast("Nota creada con éxito.");
          
          this.cancelCreation();
        },
        (error) => {
          console.error('Error al crear la nota:', error);
        }
      )
    } else {
      console.log('Updating note:', this.newNote);
      console.log('Updating note:', this.newNote);
      this.notesService.updateNote(this.newNote.id, this.newNote, this.token).subscribe(
        (response) => {
          console.log('Nota actualizada:', response);
          this.showToast("Nota actualizada con éxito.");
          const index = this.notes.findIndex(note => note.id === response.id);
          if (index !== -1) {
            this.notes[index] = response;
            this.filteredNotes[index] = response;
          }
          this.cancelCreation(); // Salir del modo de creación
        },
        (error) => {
          console.error('Error al actualizar la nota:', error);
        }
      );
    }
  }
  loadNotes(archived: boolean): void {
    this.selectedSection = archived ? 'archived' : 'all';
    this.selectedTag = null;
    this.archived = archived;

    console.log('Token: ' + this.token);

    this.notesService.getNotesByUserAndArchived(this.userId, this.archived, this.token).subscribe((data: any) => {
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
    this.newNote = note;
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
  archiveNote() {
    if (!this.selectedNote || this.selectedNote.id === null || this.selectedNote.id === 0) {
      this.showToast("Seleccione una nota.");
      return;
    }
  
    this.notesService.archiveNote(this.selectedNote.id).subscribe(
      (archivedNote) => {
        console.log('Nota archivada:', archivedNote);
        this.loadNotes(false);
        this.showToast("Nota archivada con éxito.");
      },
      (error) => {
        console.error('Error al archivar la nota:', error);
      }
    );
  }

  // Método para eliminar una nota
  confirmDelete() {
    if (!this.selectedNote || this.selectedNote.id === null || this.selectedNote.id === 0) {
      this.showToast("Seleccione una nota.");
      return;
    }
  
    this.notesService.deleteNote(this.selectedNote.id).subscribe(
      () => {
        console.log('Nota eliminada');
        this.loadNotes(false);
        this.showToast("Nota eliminada con éxito.");
        this.cancelDelete();
        this.selectedNote = null;
      },
      (error) => {
        console.error('Error al eliminar la nota:', error);
        this.cancelDelete();
      }
    );
  }

  openDeleteModal(): void {
    this.isDeleteModalOpen = true;
  }

  // Método para cancelar la eliminación
  cancelDelete(): void {
    this.isDeleteModalOpen = false;
  }



  toggleArchiveState() {
    if (this.selectedSection === 'archived') {
      // Si el estado actual es "archivado", desarchivar
      this.unarchiveNote();
    } else {
      // Si el estado actual es "no archivado", archivar
      this.archiveNote();
    }
  }
  unarchiveNote() {
    if (!this.selectedNote || this.selectedNote.id === null || this.selectedNote.id === 0) {
      this.showToast("Seleccione una nota.");
      return;
    }
  
    this.notesService.unarchiveNote(this.selectedNote.id).subscribe(
      (unarchivedNote) => {
        console.log('Nota desarchivada:', unarchivedNote);
        this.loadNotes(false);
        this.showToast("Nota desarchivada con éxito.");
      },
      (error) => {
        console.error('Error al desarchivar la nota:', error);
      }
    );
  }
}