import { Injectable } from '@angular/core';
import { SysAdminUnit } from './interfaces';
import { USER_COLLECTION_NAME } from './constants';
import { environment } from '../environments/environment';

/**
 * Репозиторий для работы с пользователями.
 */
@Injectable({
	providedIn: 'root'
})
export class UserRepositoryService {
	constructor() {}

	// Хост.
	private _host = environment.production ? document.location.origin : environment.host;

	/**
	 * Создать пользователя.
	 * @param user Пользователь.
	 * @returns true, если успех.
	 */
	async createUser(user: SysAdminUnit): Promise<SysAdminUnit | null> {
		let response = await fetch(`${this._host}/${USER_COLLECTION_NAME}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});
	
		
		if (!response.ok) {
			alert("Error occured. See console.");
			return null;
		}
		
		return response.json();
	}

	/**
	 * Получить пользователей.
	 * @param queryParameters Параметры запроса.
	 * @returns Список пользователей.
	 */
	async getUsers(queryParameters: string): Promise<SysAdminUnit[] | null> {
		let url = "";
		if (!queryParameters) {
			url = `${this._host}/${USER_COLLECTION_NAME}`;
		} else {
			url = `${this._host}/${USER_COLLECTION_NAME}?${queryParameters}`;
		}

		let response = await fetch(url);
		if (!response.ok) {
			alert("Error occured. See console.");
			return null;
		}

		return response.json();
	}

	/**
	 * Обновить пользователя.
	 * @param userId Ид. пользователя.
	 * @param modification Модификация.
	 * @returns true, если успех.
	 */
	async updateUser(userId: string, modification: SysAdminUnit): Promise<boolean> {
		if (!userId) {
			throw new Error("Admin unit has empty id");
		}

		let response = await fetch(`${this._host}/${USER_COLLECTION_NAME}?id=${userId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(modification),
		});
	
		if (!response.ok) {
			alert("Error occured. See console.");
			return false;
		}
		
		return true;
	}

	/**
	 * Удалить пользователя.
	 * @param userId Ид. пользователя.
	 * @returns true, если успех.
	 */
	async deleteUser(userId: string): Promise<boolean> {
		let response = await fetch(`${this._host}/${USER_COLLECTION_NAME}?id=${userId}`, {
			method: "DELETE"
		});
		
		if (!response.ok) {
			alert("Error occured. See console.");
			return false;
		}

		return true;
	}
}
