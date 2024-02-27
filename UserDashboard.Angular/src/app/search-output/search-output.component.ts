import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SysAdminUnit, UserDialogConfig } from '../interfaces';
import { UserRepositoryService } from '../user-repository.service';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { USER_DIALOG_MODES } from '../constants';

@Component({
  selector: 'app-search-output',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './search-output.component.html',
  styleUrl: './search-output.component.css'
})
export class SearchOutputComponent {
	/**
	 * Пользователи.
	 */
	@Input()
	users: SysAdminUnit[] = [];

	/**
	 * Доступность кнопки "Обновить".
	 */
	isUpdateButtonDisabled = false;

	/**
	 * Конструктор.
	 * @param _userRepository Репозиторий.
	 * @param _dialog Диалог.
	 */
	constructor(private _userRepository: UserRepositoryService,
				private _dialog: MatDialog) {}

	/**
	 * Обработчик нажатия кнопки "Обновить".
	 * @param user Пользователь.
	 */
	updateButtonClick(user: SysAdminUnit) {
		if (!user.id) {
			throw new Error("Admin unit has empty id");
		}

		let config = new MatDialogConfig<UserDialogConfig>();
		config.data = {
			mode: USER_DIALOG_MODES.UPDATE,
			defaultValues: new Map([["active", user.active || false]]),
		};

		let dialogRef = this._dialog.open<UserDialogComponent, UserDialogConfig, SysAdminUnit>(UserDialogComponent, config)
		dialogRef.afterOpened().subscribe(() => this.isUpdateButtonDisabled = true);
		dialogRef.afterClosed().subscribe(async (modification) => {
			this.isUpdateButtonDisabled = false;
			if (!modification || !user.id) {
				return;
			}

			if (await this._userRepository.updateUser(user.id, modification)) {
				Object.assign(user, modification);
			}
		});
	}

	/**
	 * Обработчик нажатия кнопки "Удалить".
	 * @param user Пользователь.
	 */
	async deleteButtonClick(user: SysAdminUnit) {
		if (!user.id) {
			throw new Error("Admin unit has empty id");
		}

		if (await this._userRepository.deleteUser(user.id)) {
			let position = this.users.findIndex((i) => i.id === user.id);
			if (position !== -1) {
				this.users.splice(position, 1);
			}
		}
	}
}
