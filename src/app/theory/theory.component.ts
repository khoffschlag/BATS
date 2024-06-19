import { Component, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-theory',
  standalone: true,
  imports: [],
  templateUrl: './theory.component.html',
  styleUrl: './theory.component.css'
})
export class TheoryComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  param: string = "";
  data = {title: "", description: ""};

  constructor(private api: ApiService) {

    this.param = this.route.snapshot.params['topic'];
    this.api.getTheory(this.param).subscribe(data => this.data = {
      title: (data as any).title,
      description:  (data as any).description
    });
    
  }
  

}
