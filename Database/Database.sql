USE [master]
GO
/****** Object:  Database [Chatbot]    Script Date: 10/06/2021 08:24:51 ******/
CREATE DATABASE [Chatbot]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Chatbot', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.SQLEXPRESS\MSSQL\DATA\Chatbot.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Chatbot_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.SQLEXPRESS\MSSQL\DATA\Chatbot_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [Chatbot] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Chatbot].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Chatbot] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Chatbot] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Chatbot] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Chatbot] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Chatbot] SET ARITHABORT OFF 
GO
ALTER DATABASE [Chatbot] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Chatbot] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Chatbot] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Chatbot] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Chatbot] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Chatbot] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Chatbot] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Chatbot] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Chatbot] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Chatbot] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Chatbot] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Chatbot] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Chatbot] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Chatbot] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Chatbot] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Chatbot] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Chatbot] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Chatbot] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Chatbot] SET  MULTI_USER 
GO
ALTER DATABASE [Chatbot] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Chatbot] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Chatbot] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Chatbot] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Chatbot] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Chatbot] SET QUERY_STORE = OFF
GO
USE [Chatbot]
GO
/****** Object:  Table [dbo].[Administrator]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Administrator](
	[id] [int] NOT NULL,
 CONSTRAINT [PK_Administrator] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Conversation]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Conversation](
	[Id] [int] NOT NULL,
 CONSTRAINT [PK_Conversation] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConversationResponse]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConversationResponse](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[response] [varchar](max) NOT NULL,
	[conversationId] [int] NOT NULL,
 CONSTRAINT [PK_ConversationResponse] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employee]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employee](
	[id] [int] NOT NULL,
	[FunctionId] [int] NOT NULL,
 CONSTRAINT [PK_Employee] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Function]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Function](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](50) NOT NULL,
	[Description] [varchar](max) NULL,
	[PermissionID] [int] NOT NULL,
 CONSTRAINT [PK_Function] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Function_Rule]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Function_Rule](
	[RuleID] [int] NOT NULL,
	[FunctionID] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Input]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Input](
	[id] [int] NULL,
	[valueType] [varchar](50) NULL,
	[controlType] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InputValueType]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InputValueType](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[type] [varchar](50) NULL,
 CONSTRAINT [PK_SequenceMessageValueType] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_SequenceMessageValueType] UNIQUE NONCLUSTERED 
(
	[type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MessageHistory]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MessageHistory](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Message] [varchar](max) NOT NULL,
	[Date] [varchar](50) NULL,
	[UserId] [int] NOT NULL,
	[RuleTitle] [varchar](50) NOT NULL,
 CONSTRAINT [PK_MessageHistory] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Option]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Option](
	[id] [int] NOT NULL,
 CONSTRAINT [PK_SequenceOption_1] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OptionMessage]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OptionMessage](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[message] [varchar](50) NULL,
	[value] [varchar](50) NULL,
	[optionId] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permission]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permission](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](max) NOT NULL,
	[Description] [varchar](max) NULL,
 CONSTRAINT [PK_Permission] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rule]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rule](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](50) NOT NULL,
	[Description] [varchar](max) NULL,
	[RuleType] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Rule_1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_Rule] UNIQUE NONCLUSTERED 
(
	[Title] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RuleType]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RuleType](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Type] [varchar](50) NOT NULL,
 CONSTRAINT [PK_RuleType] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_RuleType] UNIQUE NONCLUSTERED 
(
	[Type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SequenceMessage]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SequenceMessage](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Question] [varchar](max) NOT NULL,
	[Attribute] [varchar](max) NOT NULL,
	[RuleID] [int] NOT NULL,
	[SequenceType] [varchar](50) NOT NULL,
 CONSTRAINT [PK_SequenceMessage] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SequenceMessageType]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SequenceMessageType](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Type] [varchar](50) NOT NULL,
 CONSTRAINT [PK_SequenceMessageType_1] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_SequenceMessageType] UNIQUE NONCLUSTERED 
(
	[Type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task](
	[id] [int] NOT NULL,
	[Method] [varchar](10) NOT NULL,
	[Api] [varchar](max) NOT NULL,
	[ResponseType] [varchar](50) NOT NULL,
	[graphType] [varchar](50) NULL,
 CONSTRAINT [PK_Task] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TaskResponseType]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaskResponseType](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[type] [varchar](50) NOT NULL,
 CONSTRAINT [PK_TaskResponseType_1] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UniqueType] UNIQUE NONCLUSTERED 
(
	[type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Trigger]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Trigger](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Message] [varchar](max) NOT NULL,
	[RuleID] [int] NOT NULL,
 CONSTRAINT [PK_Trigger] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[Name] [varchar](50) NULL,
	[Lastname] [varchar](50) NULL,
	[Address] [varchar](50) NULL,
	[TelephoneNum] [varchar](50) NULL,
	[Password] [varchar](50) NOT NULL,
	[Email] [varchar](50) NULL,
	[UserType] [varchar](50) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserType]    Script Date: 10/06/2021 08:24:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Type] [varchar](50) NOT NULL,
 CONSTRAINT [PK_UserType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Function]    Script Date: 10/06/2021 08:24:51 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_Function] ON [dbo].[Function]
(
	[Title] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_User]    Script Date: 10/06/2021 08:24:51 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_User] ON [dbo].[User]
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_UserType]    Script Date: 10/06/2021 08:24:51 ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_UserType] ON [dbo].[UserType]
(
	[Type] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Administrator]  WITH CHECK ADD  CONSTRAINT [FK_Administrator_User] FOREIGN KEY([id])
REFERENCES [dbo].[User] ([id])
GO
ALTER TABLE [dbo].[Administrator] CHECK CONSTRAINT [FK_Administrator_User]
GO
ALTER TABLE [dbo].[Conversation]  WITH CHECK ADD  CONSTRAINT [FK_Conversation_Rule] FOREIGN KEY([Id])
REFERENCES [dbo].[Rule] ([Id])
GO
ALTER TABLE [dbo].[Conversation] CHECK CONSTRAINT [FK_Conversation_Rule]
GO
ALTER TABLE [dbo].[ConversationResponse]  WITH CHECK ADD  CONSTRAINT [FK_ConversationResponse_Conversation] FOREIGN KEY([conversationId])
REFERENCES [dbo].[Conversation] ([Id])
GO
ALTER TABLE [dbo].[ConversationResponse] CHECK CONSTRAINT [FK_ConversationResponse_Conversation]
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [FK_Employee_Function1] FOREIGN KEY([FunctionId])
REFERENCES [dbo].[Function] ([id])
GO
ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [FK_Employee_Function1]
GO
ALTER TABLE [dbo].[Employee]  WITH CHECK ADD  CONSTRAINT [FK_Employee_User] FOREIGN KEY([id])
REFERENCES [dbo].[User] ([id])
GO
ALTER TABLE [dbo].[Employee] CHECK CONSTRAINT [FK_Employee_User]
GO
ALTER TABLE [dbo].[Function]  WITH CHECK ADD  CONSTRAINT [FK_Function_Permission] FOREIGN KEY([PermissionID])
REFERENCES [dbo].[Permission] ([Id])
GO
ALTER TABLE [dbo].[Function] CHECK CONSTRAINT [FK_Function_Permission]
GO
ALTER TABLE [dbo].[Function_Rule]  WITH CHECK ADD  CONSTRAINT [FK_Function_Rule_Function] FOREIGN KEY([FunctionID])
REFERENCES [dbo].[Function] ([id])
GO
ALTER TABLE [dbo].[Function_Rule] CHECK CONSTRAINT [FK_Function_Rule_Function]
GO
ALTER TABLE [dbo].[Function_Rule]  WITH CHECK ADD  CONSTRAINT [FK_Function_Rule_Rule] FOREIGN KEY([RuleID])
REFERENCES [dbo].[Rule] ([Id])
GO
ALTER TABLE [dbo].[Function_Rule] CHECK CONSTRAINT [FK_Function_Rule_Rule]
GO
ALTER TABLE [dbo].[Input]  WITH CHECK ADD  CONSTRAINT [FK_Input_SequenceMessage] FOREIGN KEY([id])
REFERENCES [dbo].[SequenceMessage] ([Id])
GO
ALTER TABLE [dbo].[Input] CHECK CONSTRAINT [FK_Input_SequenceMessage]
GO
ALTER TABLE [dbo].[Input]  WITH CHECK ADD  CONSTRAINT [FK_Input_SequenceMessageValueType] FOREIGN KEY([valueType])
REFERENCES [dbo].[InputValueType] ([type])
GO
ALTER TABLE [dbo].[Input] CHECK CONSTRAINT [FK_Input_SequenceMessageValueType]
GO
ALTER TABLE [dbo].[MessageHistory]  WITH CHECK ADD  CONSTRAINT [FK_MessageHistory_Rule] FOREIGN KEY([RuleTitle])
REFERENCES [dbo].[Rule] ([Title])
GO
ALTER TABLE [dbo].[MessageHistory] CHECK CONSTRAINT [FK_MessageHistory_Rule]
GO
ALTER TABLE [dbo].[MessageHistory]  WITH CHECK ADD  CONSTRAINT [FK_MessageHistory_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([id])
GO
ALTER TABLE [dbo].[MessageHistory] CHECK CONSTRAINT [FK_MessageHistory_User]
GO
ALTER TABLE [dbo].[Option]  WITH CHECK ADD  CONSTRAINT [FK_Option_SequenceMessage] FOREIGN KEY([id])
REFERENCES [dbo].[SequenceMessage] ([Id])
GO
ALTER TABLE [dbo].[Option] CHECK CONSTRAINT [FK_Option_SequenceMessage]
GO
ALTER TABLE [dbo].[OptionMessage]  WITH CHECK ADD  CONSTRAINT [FK_OptionMessage_Option] FOREIGN KEY([optionId])
REFERENCES [dbo].[Option] ([id])
GO
ALTER TABLE [dbo].[OptionMessage] CHECK CONSTRAINT [FK_OptionMessage_Option]
GO
ALTER TABLE [dbo].[Rule]  WITH CHECK ADD  CONSTRAINT [FK_Rule_RuleType] FOREIGN KEY([RuleType])
REFERENCES [dbo].[RuleType] ([Type])
GO
ALTER TABLE [dbo].[Rule] CHECK CONSTRAINT [FK_Rule_RuleType]
GO
ALTER TABLE [dbo].[SequenceMessage]  WITH CHECK ADD  CONSTRAINT [FK_SequenceMessage_Rule] FOREIGN KEY([RuleID])
REFERENCES [dbo].[Task] ([id])
GO
ALTER TABLE [dbo].[SequenceMessage] CHECK CONSTRAINT [FK_SequenceMessage_Rule]
GO
ALTER TABLE [dbo].[SequenceMessage]  WITH CHECK ADD  CONSTRAINT [FK_SequenceMessage_SequenceMessageType] FOREIGN KEY([SequenceType])
REFERENCES [dbo].[SequenceMessageType] ([Type])
GO
ALTER TABLE [dbo].[SequenceMessage] CHECK CONSTRAINT [FK_SequenceMessage_SequenceMessageType]
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD  CONSTRAINT [FK_Task_Rule] FOREIGN KEY([id])
REFERENCES [dbo].[Rule] ([Id])
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK_Task_Rule]
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD  CONSTRAINT [FK_Task_TaskResponseType] FOREIGN KEY([ResponseType])
REFERENCES [dbo].[TaskResponseType] ([type])
GO
ALTER TABLE [dbo].[Task] CHECK CONSTRAINT [FK_Task_TaskResponseType]
GO
ALTER TABLE [dbo].[Trigger]  WITH CHECK ADD  CONSTRAINT [FK_Trigger_Rule] FOREIGN KEY([RuleID])
REFERENCES [dbo].[Rule] ([Id])
GO
ALTER TABLE [dbo].[Trigger] CHECK CONSTRAINT [FK_Trigger_Rule]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [FK_User_UserType] FOREIGN KEY([UserType])
REFERENCES [dbo].[UserType] ([Type])
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_User_UserType]
GO
USE [master]
GO
ALTER DATABASE [Chatbot] SET  READ_WRITE 
GO
