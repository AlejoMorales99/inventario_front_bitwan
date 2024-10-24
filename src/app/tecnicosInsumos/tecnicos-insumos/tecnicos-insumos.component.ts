import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tecnicos-insumos',
  templateUrl: './tecnicos-insumos.component.html',
  styleUrls: ['./tecnicos-insumos.component.css']
})
export class TecnicosInsumosComponent implements OnInit {

constructor(private loginService:LoginService,private rout: Router){}



  ngOnInit(): void {
    const usuario = this.loginService.getUser();


    if (usuario == null) {

      //mensaje de error por si no loguea
      Swal.fire({
        title: 'ERROR',
        text: 'POR FAVOR INICIE SESION PRIMERO',
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

      this.rout.navigate(['']);


    }


  }



}
