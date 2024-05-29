import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { MarcaService } from 'src/app/services/marca/marca.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-marca',
  templateUrl: './editar-marca.component.html',
  styleUrls: ['./editar-marca.component.css']
})
export class EditarMarcaComponent {


idMarca: string = this.rutaActiva.snapshot.paramMap.get('id')!;

constructor(private marcaServices:MarcaService, private rutaActiva: ActivatedRoute,private rout: Router,private loginServices: LoginService){}

marca:string = ""

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
    this.marcaServices.getOneMarca(this.idMarca).subscribe((res:any)=>{
      this.marca = res[0].marcacol;
    })
  }

}

putMarca(){

  if(this.marca==""){
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
  }else if(this.marca.length>=15){
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

    this.marcaServices.putMarca(this.idMarca,this.marca).subscribe(res=>{

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

      this.rout.navigate(['/marca']);



    })



  }

}

}
