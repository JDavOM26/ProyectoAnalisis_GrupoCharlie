import { Component } from '@angular/core';
import { RecuperacioncontraseniaService } from '../../Service/recuperacioncontrasenia.service';
import { PasswordRecoveryResponseDto } from '../../Models/password-recovery-response.dto';
import { PasswordRecoveryAnswerDto } from '../../Models/password-recovery-answer.dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-password-recovery',
  imports: [CommonModule, FormsModule],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.css'
})
export class PasswordRecovery {
  idUsuario: string = '';
  respuesta: string = '';
  pregunta: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isAnswerValid: boolean | null = null;
  emailSent: boolean = false;

  constructor(private recuperacionService: RecuperacioncontraseniaService, private router: Router) { }

  obtenerPregunta() {
    if (!this.idUsuario.trim()) {
      this.errorMessage = 'Por favor, ingrese un ID de usuario';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.pregunta = null;

    this.recuperacionService.getPregunta(this.idUsuario).subscribe({
      next: (response: PasswordRecoveryResponseDto) => {
        this.pregunta = response.pregunta;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }
  verificarRespuesta() {
    if (!this.respuesta.trim()) {
      this.errorMessage = 'Por favor, ingrese una respuesta';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.isAnswerValid = null;

    const answerDto: PasswordRecoveryAnswerDto = {
      idUsuario: this.idUsuario,
      respuesta: this.respuesta
    };

    this.recuperacionService.postRespuesta(answerDto).subscribe({
      next: (isValid: boolean) => {
        this.isAnswerValid = isValid;
        this.isLoading = false;
        if (isValid) {
          this.errorMessage = null;
          this.sendEmail();
        } else {
          this.errorMessage = 'Respuesta incorrecta';
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }
  private sendEmail() {
    this.isLoading = true;
    this.recuperacionService.sendEmail(this.idUsuario).subscribe({
      next: (response: string) => {
        this.emailSent = true;
        this.isLoading = false;
        
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }
}