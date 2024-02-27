import { Component } from '@angular/core';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { SysAdminUnit, UserDialogConfig} from '../interfaces';
import { UserRepositoryService } from '../user-repository.service';
import { USER_DIALOG_MODES } from '../constants';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchOutputComponent } from '../search-output/search-output.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchOutputComponent, UserDialogComponent, MatDialogModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
	/**
	 * Доступность кнопки "Добавить".
	 */
	isAddButtonDisabled = false;

	/**
	 * Конструктор.
	 * @param _userRepository Репозиторий.
	 * @param _dialog Диалог.
	 */
	constructor(private _userRepository: UserRepositoryService,
				private _dialog: MatDialog) {}
	
	/**
	 * Обработчик нажатия кнопки "Добавить".
	 */
	addButtonClick(): void {
		let config = new MatDialogConfig<UserDialogConfig>();
		config.data = {
			mode: USER_DIALOG_MODES.CREATE,
		};

		let dialogRef = this._dialog.open<UserDialogComponent, UserDialogConfig, SysAdminUnit>(UserDialogComponent, config)
		dialogRef.afterOpened().subscribe(() => this.isAddButtonDisabled = true);
		dialogRef.afterClosed().subscribe(async (user) => {
			this.isAddButtonDisabled = false;
			if (!user) {
				return;
			}

			let createdUser = await this._userRepository.createUser(user);
			
			this.users?.then((collection) => {
				if (createdUser !== null) {
					collection?.unshift(createdUser);
				}
			});
		});
	}

	/**
	 * Форма поиска.
	 */
	searchForm = new FormGroup({
		name: new FormControl("", Validators.required),
		rows: new FormControl(15, [Validators.min(1), Validators.required]),
	});

	/**
	 * Пользователи.
	 */
	users: Promise<SysAdminUnit[] | null> | null = null;

	/**
	 * Получить параметры запроса.
	 * @returns Строка для передачи в GET-запрос.
	 */
	getQueryParameters() {
		let params = "";
		let hasParameters = false;

		for (const key in this.searchForm.controls) {
			let control = this.searchForm.get(key);
			if (control?.valid) {
				hasParameters = true;
				params += `${key}=${control.value}&`;
			}
		}

		if (hasParameters) {
			params = params.slice(0, params.length - 1);
		}

		return params;
	}

	/**
	 * Обработчик нажатия кнопки поиска.
	 * @param e Событие клика.
	 */
	searchButtonClick(e: Event) {
		e.preventDefault();
		this.users = this._userRepository.getUsers(this.getQueryParameters());
	}
}