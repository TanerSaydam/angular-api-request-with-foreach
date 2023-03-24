import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { concatMap, from } from 'rxjs';
import { TodoModel } from './todos.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  api :string = "https://jsonplaceholder.typicode.com/todos";
  todos: TodoModel[] = [];

  constructor(
    private _http: HttpClient
  ){}

  ngOnInit(): void {
    
  }


  operateTheList(){
    this._http.get<TodoModel[]>(this.api).subscribe(res=>{
      from(res).pipe(
        concatMap((todo: TodoModel)=>{
          todo.isCompleted = true;
          return this._http.put<TodoModel>(`${this.api}/${todo.id}`,todo)
        })
      ).subscribe({
        next: (res: TodoModel) =>{
          res.result = true;
          this.todos.push(res);
        },
        error: (err: HttpErrorResponse)=> {
          console.log(err);
        },
        complete: ()=> {
          console.log("İşlem tamamlandı!")
        }
      });
    })
  }

}
