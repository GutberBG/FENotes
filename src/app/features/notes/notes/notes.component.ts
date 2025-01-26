import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../notes.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes: any[] = []; // Array para almacenar las notas
  userId: number = 0; // Reemplázalo con el id del usuario actualmente autenticado
  archived: boolean = false; // Para obtener notas archivadas o no

  constructor(private notesService: NotesService, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('NotesComponent initialized');

    // Recuperar userId desde el localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.userId = parsedUser.userId;
      console.log('User ID from localStorage:', this.userId);
    }

    // Verificar si el usuario está autenticado
    this.authService.getCurrentUser().subscribe((user) => {
      if (user && this.userId !== null) {
        this.loadNotes(); // Carga las notas si el usuario está autenticado y tiene userId
      }
    });
  }

  loadNotes(): void {
    const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).token : '';
    console.log('Token: ' + token);
    
    this.notesService.getNotesByUser(this.userId, token).subscribe((data: any) => {
      this.notes = data;
    });
  }

  loadArchivedNotes(): void {
    this.notesService.getUserArchivedNotes(this.userId, this.archived).subscribe((data: any) => {
      this.notes = data;
    });
  }

  toggleArchived(): void {
    this.archived = !this.archived;
    this.loadArchivedNotes();
  }
}