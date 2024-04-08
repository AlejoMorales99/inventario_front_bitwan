import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent {


idCategoria: string = this.rutaActiva.snapshot.paramMap.get('id')!;

constructor(private rutaActiva: ActivatedRoute,private rout: Router, private categoriaServices:CategoriasService,private loginServices: LoginService){}

categoria:string = ""

ngOnInit(){

  const usuario = this.loginServices.getUser();

  if(usuario == null){
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



  }else if(usuario.data.nombres!= "KAROL YISETH" && usuario.data.nombres!="MARI LUZ"){
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

    this.categoriaServices.getOneCategoria(this.idCategoria).subscribe((res:any)=>{
      this.categoria = res[0].nombre;
    })

  }



}

putCategoria(){

  if(this.categoria==""){
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
  }else if(this.categoria.length>=15){
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

    this.categoriaServices.putCategorias(this.idCategoria,this.categoria).subscribe(res=>{

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

      this.rout.navigate(['/categorias']);

    })


  }

}

}
