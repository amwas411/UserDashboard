import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SysAdminUnit, UserDialogConfig } from '../interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { USER_DIALOG_MODES } from '../constants';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent {
	userForm = new FormGroup({
		name: new FormControl(""),
		active: new FormControl(false),
		contactName: new FormControl(""),
		userPassword: new FormControl(""),
	});
	
	/**
	 * Конструктор диалога пользователя.
	 * @param _data Данные, переданные в диалог.
	 * @param _selfRef Ссылка на себя.
	 */
	constructor(@Inject(MAT_DIALOG_DATA) private _data: UserDialogConfig, 
				private _selfRef: MatDialogRef<UserDialogComponent>) 
	{
		if (_data.defaultValues) {
			for (let columnValue of _data.defaultValues) {
				this.userForm.get(columnValue[0])?.setValue(columnValue[1]);
			}
		}
	}

	/**
	 * Обработчик нажатия кнопки "ОК".
	 * @param e Событие клика.
	 */
	async dialogOkButtonClick(e: Event): Promise<void> {
		e.preventDefault();
		if (!this.userForm.valid && this._data.mode === USER_DIALOG_MODES.CREATE) {
			alert("Some of the required columns are not provided.");
			return;
		}

		let user: SysAdminUnit = {
			active: this.userForm.value.active || false,
		};

		if (this.userForm.value.name) {
			user.name = this.userForm.value.name;
		}

		if (this.userForm.value.userPassword) {
			user.userPassword = this.userForm.value.userPassword;
		}

		if (this.userForm.value.contactName) {
			user.contact = {
				name: this.userForm.value.contactName
			};
		}

		this._selfRef.close(user);
	}

	/**
	 * Обработчик нажатия кнопки "Закрыть".
	 * @param e Событие клика.
	 */	
	dialogCloseButtonClick(e: Event): void {
		e.preventDefault();
		this._selfRef.close();
	}
}
