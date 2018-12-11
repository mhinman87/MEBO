import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { sum, values } from 'lodash';


/**
 * Generated class for the UpvoteButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'upvote-button',
  templateUrl: 'upvote-button.html'
})
export class UpvoteButtonComponent implements OnInit, OnDestroy {

  @Input() userId;
  @Input() itemId; 
  @Input() ownerId;

  voteCount: number = 0;
  userVote: number = 0;

  subscription;

  constructor(private db: DatabaseProvider) {

  }

  ngOnInit() {

    
      this.subscription = this.db.getItemVotes(this.itemId)
                        .subscribe(upvotes => {
                          if (this.userId) this.userVote = upvotes[this.userId]
                          this.voteCount = sum(values(upvotes))
                        })
    
  }

  upvote(){
    if(this.userVote == 1) {
      this.userVote = 0;
    } else if (this.userVote == 0){
      this.userVote = 1;
    } else {
      this.userVote = 1;
    }
    this.db.updateUserVote(this.itemId, this.userId, this.userVote, this.ownerId);
  }

  downvote(){
    if(this.userVote == -1) {
      this.userVote = 0;
    } else if (this.userVote == 0){
      this.userVote = -1;
    } else {
      this.userVote = -1;
    }
    this.db.updateUserVote(this.itemId, this.userId, this.userVote, this.ownerId);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
