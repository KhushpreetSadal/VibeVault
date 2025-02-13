import { Component, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { PlaylistComponent } from './playlist/playlist.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TitleCasePipe,NgIf,NgFor,FormsModule,FooterComponent,PlaylistComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
 animations: [
    trigger('fadeInOut', [
      transition('*<=>*',[

        query(':self', [
          style({ opacity: 0 }),
          animate('1s ease-out', style({ opacity: 1, })),
        ]),
        query(':self', [
          animate( '1s 2s ease-in', style({ opacity: 0,})),
        ]),
      ])
    ]),
  ],
})

@Injectable({
  providedIn:'root'
})

export class AppComponent {
  
  title = 'vibeVault';
  http = inject(HttpClient);
  list: any = [];
  song: any = [];
  allmusic:any = [];
  music:any = {}
  result:any = []

  ngOnInit(): void {
    this.getTrandingSongs();
    this.getAllSongs()
  }


  show=false
  search(data:any){
    if (data != "") {
      this.show = true
      let name = data.input.toLocaleLowerCase()
      this.result = []
      if (name.length) {
        let max = 0
        this.allmusic.forEach((ele: any) => {

          if(max<=7){
            let user = ele.title.toLocaleLowerCase()
            if (user.includes(name)) {
                this.result.push(ele)
                this.show = true
              max++;
             
            } else if (this.result.length == 0) {
              this.show = false
              max++;
            }
          }
         
        })
      }

    } else {
      this.show = false
    }

  }


  resetForm(form: NgForm): void {
    form.reset();
  }

  getAllSongs(){
    this.http.get('./allSongs.json').subscribe((res:any)=>{
      this.allmusic = res.songs
    
    })
  }

  getTrandingSongs() {
    this.http.get('./trending.json').subscribe((res: any) => {
      this.list = res.trending;
      this.shuffleSongs();
      this.path(this.list[0])
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async shuffleSongs() {
    const delaytime = 3900;
    let i = 0;
    
    while (true) {
      this.song = this.list[i];
      await this.delay(delaytime);
      i++;
      if (i >= this.list.length) {
        i = 0;
      }
    }
  }

  setPath(data:any,id:any){
   this.music = data;
   this.songNo = id;
   this.show = false
   this.setdata();
  }
  
  path(data:any){
    this.music = data;
    this.audio.src = this.song.source;
    this.audio.addEventListener('timeupdate', () => {
      if(this.audio.currentTime == this.audio.duration){
        this.isPlaying = false
        if(this.All)
          this.next()
      }
      this.time = this.formatTime(this.audio.currentTime);
      this.fullduration = this.formatTime(this.audio.duration);
      this.currentTime = this.audio.currentTime;
      this.duration = this.audio.duration;
    });
  }


  formatTime(time: number): string {
    const minutes: number = Math.floor(time / 60);
    const seconds: number = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  


  audio = new Audio();
  isPlaying = false;
  currentTime = 0
  duration = 0;
  time = "0:00";
  fullduration = "3:41";
  All = true;


  setdata(){
    this.audio.src = this.music.source;
    this.audio.play();
    this.isPlaying = true;
    this.audio.addEventListener('timeupdate', () => {
      
      if(this.time == this.fullduration){
        this.isPlaying == false
        if(this.All)
        this.next()
      }
      
      this.time = this.formatTime(this.audio.currentTime);
      this.fullduration = this.formatTime(this.audio.duration);
      this.currentTime = this.audio.currentTime;
      this.duration = this.audio.duration;
    });
  }


  togglePlay() {
    console.log()
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  seek(event: any) {
    const newTime = event.target.value;
    this.audio.currentTime = newTime;
  }

  pause(){
    this.isPlaying = false;
    this.audio.pause()
  }

  start(item:any,id:any){
    if(this.isPlaying == true && this.music.id == id){
      this.audio.pause()
    this.isPlaying = false
  }
  else{
     this.setPath(item,id)
   }
  }

  songNo = 0;

  previous(){
  
    if(this.songNo > 0 ){
      this.songNo--;
      this.setPath(this.allmusic[this.songNo],this.songNo)
    }else{
      
      this.songNo = this.allmusic.length-1;
      this.setPath(this.allmusic[this.songNo],this.songNo)
    }
  
  }
  next(){
    if(this.songNo < this.allmusic.length-1){
      
      this.songNo++
      this.setPath(this.allmusic[this.songNo],this.songNo)
    }else{
      this.songNo = 0
      this.setPath(this.allmusic[this.songNo],this.songNo)

    }
  }

  playAll(){
    if(this.All){
      this.All = false;
    }else{
      this.All = true; 
    }
  }



  

}


