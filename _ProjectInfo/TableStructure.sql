/*
 Navicat Premium Data Transfer

 Source Server Type    : SQL Server
 Source Server Version : 14001000
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 14001000
 File Encoding         : 65001

 Date: 16/05/2020 15:38:54
*/


-- ----------------------------
-- Table structure for COMPANY_INFO
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[COMPANY_INFO]') AND type IN ('U'))
	DROP TABLE [dbo].[COMPANY_INFO]
GO

CREATE TABLE [dbo].[COMPANY_INFO] (
  [UID] int  IDENTITY(1,1) NOT NULL,
  [NAME] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [ADDRESS] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [TELEPHONE] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [FAX] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL
)
GO

ALTER TABLE [dbo].[COMPANY_INFO] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Table structure for PRODUCT_INFO
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[PRODUCT_INFO]') AND type IN ('U'))
	DROP TABLE [dbo].[PRODUCT_INFO]
GO

CREATE TABLE [dbo].[PRODUCT_INFO] (
  [UID] int  IDENTITY(1,1) NOT NULL,
  [NAME] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [SPEC1] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [SPEC2] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [TYPE] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [UNIT] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [PRICE] numeric(38,8)  NULL,
  [COMPANY_UID] int  NULL
)
GO

ALTER TABLE [dbo].[PRODUCT_INFO] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Table structure for RECEIPT_INFO
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[RECEIPT_INFO]') AND type IN ('U'))
	DROP TABLE [dbo].[RECEIPT_INFO]
GO

CREATE TABLE [dbo].[RECEIPT_INFO] (
  [UID] int  IDENTITY(1,1) NOT NULL,
  [ID] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NOT NULL,
  [PAYEE] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NOT NULL,
  [DATE] datetime2(7)  NOT NULL
)
GO

ALTER TABLE [dbo].[RECEIPT_INFO] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Table structure for RECEIPT_ITEM_INFO
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[RECEIPT_ITEM_INFO]') AND type IN ('U'))
	DROP TABLE [dbo].[RECEIPT_ITEM_INFO]
GO

CREATE TABLE [dbo].[RECEIPT_ITEM_INFO] (
  [UID] int  IDENTITY(1,1) NOT NULL,
  [RECEIPT_UID] int  NOT NULL,
  [PRODUCT_NAME] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NOT NULL,
  [PRICE] numeric(38,8)  NOT NULL,
  [NUMBER] numeric(38,8)  NOT NULL
)
GO

ALTER TABLE [dbo].[RECEIPT_ITEM_INFO] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Table structure for RECORD
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[RECORD]') AND type IN ('U'))
	DROP TABLE [dbo].[RECORD]
GO

CREATE TABLE [dbo].[RECORD] (
  [UID] int  IDENTITY(1,1) NOT NULL,
  [INSERT_TIME] datetime2(7) DEFAULT (getdate()) NULL,
  [TAG] varchar(255) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL,
  [JSON_DATA] varchar(max) COLLATE Chinese_Taiwan_Stroke_CI_AS  NULL
)
GO

ALTER TABLE [dbo].[RECORD] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Uniques structure for table COMPANY_INFO
-- ----------------------------
ALTER TABLE [dbo].[COMPANY_INFO] ADD CONSTRAINT [UQ__COMPANY___D9C1FA007E5D8485] UNIQUE NONCLUSTERED ([NAME] ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table COMPANY_INFO
-- ----------------------------
ALTER TABLE [dbo].[COMPANY_INFO] ADD CONSTRAINT [PK__COMPANY___C5B19602352D214D] PRIMARY KEY CLUSTERED ([UID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table PRODUCT_INFO
-- ----------------------------
ALTER TABLE [dbo].[PRODUCT_INFO] ADD CONSTRAINT [PK__PRODUCT___C5B1960229F03A79] PRIMARY KEY CLUSTERED ([UID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table RECEIPT_INFO
-- ----------------------------
ALTER TABLE [dbo].[RECEIPT_INFO] ADD CONSTRAINT [PK__RECEIPT___C5B196022807C25F] PRIMARY KEY CLUSTERED ([UID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table RECEIPT_ITEM_INFO
-- ----------------------------
ALTER TABLE [dbo].[RECEIPT_ITEM_INFO] ADD CONSTRAINT [PK__RECEIPT___C5B196022A3A0A56] PRIMARY KEY CLUSTERED ([UID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Primary Key structure for table RECORD
-- ----------------------------
ALTER TABLE [dbo].[RECORD] ADD CONSTRAINT [PK__RECORD__C5B1960254457CB1] PRIMARY KEY CLUSTERED ([UID])
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)  
ON [PRIMARY]
GO


-- ----------------------------
-- Foreign Keys structure for table PRODUCT_INFO
-- ----------------------------
ALTER TABLE [dbo].[PRODUCT_INFO] ADD CONSTRAINT [FK_COMPANY_UID] FOREIGN KEY ([COMPANY_UID]) REFERENCES [COMPANY_INFO] ([UID]) ON DELETE NO ACTION ON UPDATE NO ACTION
GO

