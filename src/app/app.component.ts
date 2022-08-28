import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import {pipe} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees!: Employee[];
  public editEmployee!: Employee | null;
  @ViewChild('foo') foo!: ElementRef;
  @ViewChild('fooo') fooo!: ElementRef;
  public deleteEmployee!: Employee | null;

  constructor(private employeeService: EmployeeService){}

  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    // @ts-ignore
    document.getElementById('add-employee-form').click();
    // @ts-ignore
    this.employeeService.addEmployee({
      name:addForm.value.name,
      phone:addForm.value.phone,
      email:addForm.value.email,
      imageURL:this.foo.nativeElement.value,
      jobTitle:addForm.value.jobTitle
    }).subscribe(
      (response: Employee) => {
        console.log(addForm.value)
        console.log(this.foo.nativeElement.value)
        console.log(response)
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee:Employee): void {
    employee.imageURL = this.fooo.nativeElement.value
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId:number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(typeof this.deleteEmployee?.id)
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key:string){
    console.log(key);
    const results : Employee[]= [];
    for (const employee of this.employees){
      if (employee.name.toLowerCase().indexOf(key.toLowerCase())!== -1
        ||employee.email.toLowerCase().indexOf(key.toLowerCase())!== -1
        ||employee.phone.toLowerCase().indexOf(key.toLowerCase())!== -1
        ||employee.jobTitle.toLowerCase().indexOf(key.toLowerCase())!== -1){
        results.push(employee);
      }
    }
    this.employees=results;
    if (results.length === 0 || !key){
      this.getEmployees();
    }
  }













  public onOpenModal(employee: Employee|null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    // @ts-ignore
    container.appendChild(button);
    button.click();
  }



}
