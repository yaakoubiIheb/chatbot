import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import {MatButtonModule} from '@angular/material/button';
import { UsersComponent } from './users/users.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import{FormsModule,ReactiveFormsModule} from '@angular/forms';
import{HttpClientModule} from '@angular/common/http';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import {MatMenuModule} from '@angular/material/menu';
import { RulesComponent } from './rules/rules.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { UserDetailsComponent } from './user-details/user-details.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import { ResultsComponent } from './results/results.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { RuleDetailsComponent } from './rule-details/rule-details.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { AddRuleComponent } from './add-rule/add-rule.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DeleteRuleComponent } from './delete-rule/delete-rule.component';
import { EditRuleComponent } from './edit-rule/edit-rule.component';
import { FunctionsComponent } from './functions/functions.component';
import { AddFunctionComponent } from './add-function/add-function.component';
import { EditFunctionComponent } from './edit-function/edit-function.component';
import { DeleteFunctionComponent } from './delete-function/delete-function.component';
import { FunctionDetailsComponent } from './function-details/function-details.component';
import { HistoryComponent } from './history/history.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { ChartsModule } from 'ng2-charts';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddConversationComponent } from './add-conversation/add-conversation.component';
import { EditConversationComponent } from './edit-conversation/edit-conversation.component';
import { DeleteConversationComponent } from './delete-conversation/delete-conversation.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ConversationDetailsComponent } from './conversation-details/conversation-details.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import { StatisticsComponent } from './statistics/statistics.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { ErrorPageComponent } from './error-page/error-page.component';


















@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    ChatRoomComponent,
    UsersComponent,
    RulesComponent,
    AddUserComponent,
    UserDetailsComponent,
    ResultsComponent,
    DeleteUserComponent,
    EditUserComponent,
    RuleDetailsComponent,
    AddRuleComponent,
    DeleteRuleComponent,
    EditRuleComponent,
    FunctionsComponent,
    AddFunctionComponent,
    EditFunctionComponent,
    DeleteFunctionComponent,
    FunctionDetailsComponent,
    HistoryComponent,
    TaskDetailComponent,
    AddConversationComponent,
    EditConversationComponent,
    DeleteConversationComponent,
    ConversationDetailsComponent,
    UserHistoryComponent,
    StatisticsComponent,
    LoadingScreenComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatDialogModule,
    MatRippleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDividerModule,
    MatListModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    ChartsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatTooltipModule
  ],
  providers: [authInterceptorProviders,MatDatepickerModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
