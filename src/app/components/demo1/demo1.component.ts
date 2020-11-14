import { Component, OnInit, Input } from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {increment, decrement} from '../../counter.actions';


@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss']
})
export class Demo1Component implements OnInit {

  count$: Observable<number>;

  constructor(private store: Store<{count: number}>) { 
    this.count$ = store.select('count');
  }

  @Input()
  name: string = "hello";

  incr() {
    this.store.dispatch(increment());
  }
  decr() {
    this.store.dispatch(decrement());
  }

  ngOnInit(): void {
  }

}
