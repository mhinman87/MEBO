import { Component, Input } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { UserComment } from '../../models/comment.model';

/**
 * Generated class for the CommentSectionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'comment-section',
  templateUrl: 'comment-section.html'
})
export class CommentSectionComponent {
  @Input() questions: any;
  @Input() account: any;
  @Input() beacon: any;
  commentText = "";

  text: string;
  constructor(public database: DatabaseProvider) {

  }


  showCommentInput(q: any){
    q.hideReplyTextbox = false;
  }

  closeCommentInput(q: any){
    q.hideReplyTextbox = true;
  }

  postComment(username: string, userId: string, text: string, q:any){

    let comment: UserComment = {
      id: '',
      userId: userId,
      username: username,
      text: text,
      parent_id: q.id,
      hideReplyTextbox: true,
      time: Date.now() - 5*3600000,
      date: this.formatDate(new Date(Date.now()))
    }
    this.database.addUserCommentToBeacon(this.beacon, comment)
    this.commentText = "";
    q.hideReply = true;
  }

  formatDate(date: Date) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var time = this.formatAMPM(date);
  
    console.log(time)
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + time;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  timeSince(date) {
    
    var seconds = Math.floor((new Date().getTime() - date - 5*3600000) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
  
    if (interval > 0) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
      return interval + " hour";
    } else if (interval >1 ){
      return interval + "hours"
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }


}
