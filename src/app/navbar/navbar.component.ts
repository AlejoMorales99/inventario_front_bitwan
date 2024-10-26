import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import {  ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  insumosAdmin: boolean = false;



  constructor(private servicioLogin: LoginService ,  private rout: Router){}
  usuario:any;

  tecnicos:any;

  operacionesRol:boolean = true;
  operacionValidarActa:boolean = true;

  permisos:boolean = false;

  permiso:any



  ngOnInit(){


    this.usuario = this.servicioLogin.getUser();
    this.permiso = localStorage.getItem('permisos');


    if(this.permiso == "administrador"){
      this.insumosAdmin = true;
      this.operacionesRol = true;
    }else if(this.permiso == 'ayudanteInventario' || this.permiso == 'operaciones'){

      this.insumosAdmin = false;
      this.operacionesRol = false;

    }else{
      this.insumosAdmin = true;
      this.operacionesRol = false;
    }



  }


  cerrarSession(){

    Swal.fire({
      title: '¿Estas seguro de cerrar su session ' + this.usuario.data.nombres + " ? " ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      customClass: {
        popup: 'bg-dark',
        title: 'text-white'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioLogin.clearUser();
        this.rout.navigate(['']);
      }
    })



  }


}
