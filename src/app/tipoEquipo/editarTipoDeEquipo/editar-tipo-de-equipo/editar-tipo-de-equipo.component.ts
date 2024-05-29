import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { TipoEquipoService } from 'src/app/services/tipoEquipo/tipo-equipo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-tipo-de-equipo',
  templateUrl: './editar-tipo-de-equipo.component.html',
  styleUrls: ['./editar-tipo-de-equipo.component.css']
})
export class EditarTipoDeEquipoComponent {

idTipoDeEquipo: string = this.rutaActiva.snapshot.paramMap.get('id')!;

constructor(private rout: Router,private rutaActiva: ActivatedRoute, private tipoEquipoServices:TipoEquipoService,private loginServices: LoginService){}

tipoEquipo:string = "";


ngOnInit(){

  const usuario = this.loginServices.getUser();

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

    this.tipoEquipoServices.getOneTipoDeEquipo(this.idTipoDeEquipo).subscribe((res:any)=>{
      this.tipoEquipo = res[0].nombreEquipo;
    })

  }



}

putTipoEquipo(){

  if(this.tipoEquipo==""){
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
  }else if(this.tipoEquipo.length>=15){
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

    this.tipoEquipoServices.putTipoDeEquipo(this.idTipoDeEquipo,this.tipoEquipo).subscribe(res=>{

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

      this.rout.navigate(['/tipoEquipo']);


    })


  }

}


}
