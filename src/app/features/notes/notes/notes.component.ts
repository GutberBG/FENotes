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
  isCreatingNote = false;
  token: string = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).token : '';
  toastMessage: string = 'Nota actualizada con éxito.';

  newNote = {
    id: 0,
    title: 'Title',
    content: 'Description',
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleted: false,
    userId: 1, // Reemplazar con el ID de usuario correspondiente
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
      userId: 1,
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
    this.newNote.content = event.target.innerText;
  }

  showSuccessToast: boolean = false;
  
  // Método para mostrar el toast
  showToast(message: string) {
    this.toastMessage = message;  // Asignar el mensaje dinámico
    this.showSuccessToast = true;

    // Ocultar el toast después de 3 segundos
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 3000); // El toast desaparecerá después de 3 segundos
  }
   // Método para cerrar el toast
   closeToast() {
    this.showSuccessToast = false;
  }

  createNote() {
    if (this.isCreatingNote) {
      console.log('Creating note:', this.newNote);
      this.notesService.createNote(this.newNote, this.token).subscribe(
        (response) => {
          console.log('Nota creada:', response);
          //this.notes.push(response); // Agregar la nueva nota a la lista
          //this.filteredNotes.push(response); // Agregar a la lista filtrada
          this.cancelCreation(); // Salir del modo de creación
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
          // Actualizar las notas en la lista
          this.showToast("Nota actualizada con éxito.");
          // Encontrar la nota actualizada y reemplazarla en la lista
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
    /*this.notesService.createNote(this.newNote, this.token).subscribe(
      (response) => {
        console.log('Nota creada:', response);
        this.notes.push(response); // Agregar la nueva nota a la lista
        this.filteredNotes.push(response); // Agregar a la lista filtrada
        this.cancelCreation(); // Salir del modo de creación
      },
      (error) => {
        console.error('Error al crear la nota:', error);
      }
    );*/
  }
  loadNotes(archived: boolean): void {
    this.selectedSection = archived ? 'archived' : 'all';
    this.selectedTag = null;
    this.archived = archived; // Establece el estado de archivado

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
}