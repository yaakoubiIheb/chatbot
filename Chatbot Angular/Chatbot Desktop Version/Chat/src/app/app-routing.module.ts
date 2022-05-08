import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddConversationComponent } from './add-conversation/add-conversation.component';
import { AddRuleComponent } from './add-rule/add-rule.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { EditConversationComponent } from './edit-conversation/edit-conversation.component';
import { EditRuleComponent } from './edit-rule/edit-rule.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FunctionsComponent } from './functions/functions.component';
import { HistoryComponent } from './history/history.component';
import { LoginComponent } from './login/login.component';
import { ResultsComponent } from './results/results.component';
import { RulesComponent } from './rules/rules.component';
import { AuthService } from './services/auth.service';
import { StatisticsComponent } from './statistics/statistics.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {path:'robin',component:ChatRoomComponent,canActivate:[AuthService]},
  {path:'taches',component:ResultsComponent,canActivate:[AuthService]},
  {path:'utilisateurs',component:UsersComponent,canActivate:[AuthService]},
  {path:'connecter',component:LoginComponent},
  {path:'regles',children:[
    {path:'',component:RulesComponent,canActivate:[AuthService]},
    {path:'ajouterTache',component:AddRuleComponent,canActivate:[AuthService]},
    {path:'modifierTache/:ruleTitle',component:EditRuleComponent,canActivate:[AuthService]},
    {path:'ajouterConversation',component:AddConversationComponent,canActivate:[AuthService]},
    {path:'modifierConversation/:ruleTitle',component:EditConversationComponent,canActivate:[AuthService]},
  ]},
  {path:'roles',component:FunctionsComponent,canActivate:[AuthService]},
  {path:'historique',component:HistoryComponent,canActivate:[AuthService]},
  {path:'historique utilisateur',component:UserHistoryComponent,canActivate:[AuthService]},
  {path:'statistiques',component:StatisticsComponent,canActivate:[AuthService]},
  {path:'',redirectTo:'taches',pathMatch:'full'},
  {path:'**',component:ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
