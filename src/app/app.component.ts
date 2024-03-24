import { Component, OnInit} from '@angular/core';
import { FormBuilder,FormGroup, Validators,} from '@angular/forms';
import { EmployeeModel } from './employee-database/employee-dashboad.model';
import { ApiService } from './shared/api.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'curd';

  formValue !: FormGroup;
  employeeModelObj : EmployeeModel = new EmployeeModel();
  employeeData : any;

  constructor(private formbuilder:FormBuilder, private api : ApiService){}

  ngOnInit(): void{
    this.formValue = this.formbuilder.group({
      id : [''],
      Name : [``,Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(10)])],
      Designation : [``,Validators.required],
      Salary : [``,Validators.required]
    })
    this.getAllEmployee();
  }
   
  postEmployeeDetails(){
    this.employeeModelObj.Name = this.formValue.value.Name;
    this.employeeModelObj.Designation = this.formValue.value.Designation;
    this.employeeModelObj.Salary = this.formValue.value.Salary;

    this.api.postEmploye(this.employeeModelObj)
    .subscribe((res:any)=>{
      console.log(res);
      // alert("Employee Added");
      Swal.fire({
        icon: 'success',
        title: 'Saved Successfully',
        text: '',
        footer: '<a href="">Why do I have this issue?</a>'
      })
      this.getAllEmployee();
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
    },
    err=>{
      alert("somthing worng");
    }
    )
  }

  getAllEmployee(){
    this.api.getEmploye()
    .subscribe(res=>{
      this.employeeData = res;

    })
  }

  deleteEmployee(row:any){
    

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to recover deleted recored!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        
    this.api.deleteEmploye(row.id)
    .subscribe(res=>{
      // alert("Data Delete");
      this.getAllEmployee();
    })
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your recored is safe :)',
          'error'
        )
      }
    })
    
  }

  onEdit(row:any){
    this.formValue.controls['Name'].setValue(row.Name);
    this.formValue.controls['Designation'].setValue(row.Designation);
    this.formValue.controls['Salary'].setValue(row.Salary)

    this.api.deleteEmploye(row.id)
    .subscribe(res=>{
      // alert("Data Delete");
      this.getAllEmployee();
    })
      }

    }

  


  
  

