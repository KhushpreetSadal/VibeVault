import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent {

  http = inject(HttpClient);
  comp = inject(AppComponent)

  sidhu:any = []
  shubh:any = []
  karan:any = []
  

  ngOnInit(): void {
    this.getList()
   
   
  }

  getList(){
    this.http.get('./playlist.json').subscribe((data: any) => {
      this.sidhu = data.sidhu
      this.shubh = data.shubh
      this.karan = data.karan    
    });
  }
  
  setPlayList(num :number){

    if(num == 1){
      this.comp.allmusic = this.sidhu
      this.comp.setPath(this.sidhu[0],this.sidhu[0].id);
      console.log(this.sidhu[0],this.sidhu[0].id)
    }else if(num == 2){
      this.comp.allmusic = this.shubh
      this.comp.setPath(this.shubh[0],this.shubh[0].id);
    }else if(num == 3){
      this.comp.allmusic = this.karan
      this.comp.setPath(this.karan[0],this.karan[0].id);
    }
    else{
      this.comp.getAllSongs()
      this.comp.setPath(this.sidhu[0],this.sidhu[0].id);

    }
  }
}
