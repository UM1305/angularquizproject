import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';
 
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name : string =" ";
  public questionList : any = [];
  public currentQuestion : number = 0;
  public points : number = 0;
  counter = 60;
  correctAnswer : number =0;
  incorrectAnswer : number =0;
  interval$:any;
  progress:string="0";
  QuizComplete : boolean = true;

  constructor(private questionservice : QuestionService) { }

  ngOnInit(): void {

    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startcounter();
  }

  getAllQuestions(){
    this.questionservice.getQuestionsJson()
    .subscribe(res=>{
      this.questionList = res.questions;
    })
  }

  nextQuestion(){
    this.currentQuestion++;
  }

  previousQuestion(){
    this.currentQuestion--;
  }

  answer(currentQno:number,option:any){
    if(currentQno == this.questionList.length){
      this.QuizComplete = true;
      this.stopcounter();
    }
    if(option.correct){
      this.points = this.points + 10;
      this.correctAnswer++;
      setTimeout(()=>{
      this.currentQuestion++;
      this.resetcounter();
      this.getprogresspercent();
      }, 800);
    }
    else{
      setTimeout(()=>{
      this.points = -10;
      this.currentQuestion++;
      this.incorrectAnswer++;
      this.getprogresspercent();
      }, 800);
    }
  }

  startcounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter = 60;
        this.points = this.points - 10;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();
    }, 600000)
  }

  stopcounter(){
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetcounter(){
    this.stopcounter();
    this.counter = 60;
    this.startcounter();
  }

  restquiz(){
    this.resetcounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = "0";
  }

  getprogresspercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }
}
