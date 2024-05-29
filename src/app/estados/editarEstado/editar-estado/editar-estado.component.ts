import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadosService } from 'src/app/services/estados/estados.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-estado',
  templateUrl: './editar-estado.component.html',
  styleUrls: ['./editar-estado.component.css']
})
export class EditarEstadoComponent {

idEstados: string = this.rutaActiva.snapshot.paramMap.get('id')!;

constructor(private rout: Router,private rutaActiva: ActivatedRoute, private estadoServices:EstadosService,private loginServices: LoginService){}

estados:string = ""

ngOnInit(){

  const usuario = this.loginServices.getUser();

  //valido que el usuario no quiere entrar a las rutas de la app de manera incorrecta sin haber iniciado sesion primero
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

  }else if(usuario.data.nombres!= "KAROL YISETH" && usuario.data.nombres!="MARI LUZ" && usuario.data.nombres!="MILTON FERLEY"){
    Swal.fire({
      title: 'ERROR',
      text: 'NO TIENE PERMISOS PARA ACCERDER A ESTA RUTA',
      icon: 'error',
      customClass: {
        popup: 'bg-dark',
        title: 'text-white',
        htmlContainer: 'text-white'
      }
    });

    this.rout.navigate(['/inicio']);

  }else{

    this.estadoServices.getOneEstados(this.idEstados).subscribe((res:any)=>{
      this.estados = res[0].estadoUsocol;
    })

  }

}

putEstados(){

  if(this.estados==""){
    Swal.fire({
      title: 'ERROR',
      text: 'POR FAVOR LLENE EL CAMPO',
      icon: 'error',
      customClass: {
        popup: 'bg-dark',
        title: 'text-white',
        htmlContainer: 'text-white'
      }
    });
  }else if(this.estados.length>=15){
    Swal.fire({
      title: 'ERROR',
      text: 'POR FAVOR INGRESE UN VALOR CON UNA LONGITUD MENOR A 15 CARACTERES',
      icon: 'error',
      customClass: {
        popup: 'bg-dark',
        title: 'text-white',
        htmlContainer: 'text-white'
      }
    });
  }else{

    this.estadoServices.putEstados(this.idEstados,this.estados).subscribe(res=>{

      Swal.fire({
        title: 'EXITO',
        text: 'REGISTRO ACTUALIZADO CON EXITO',
        icon: 'success',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

      this.rout.navigate(['/estados']);



    })


  }

}


}
