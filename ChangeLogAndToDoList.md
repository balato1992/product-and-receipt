
# TODO 
  - [ ] auto complete text of Material and Receipt Page (提示歷史字串)
  - [ ] 字元提示收據項目
  - [x] add license
  - [x] backup database

  - [ ] 20200517 by Chad, turn showDetail to false when the row is disabled, maybe there has a better way to slove this
  - [ ] 起始頁面讀取(淡入)
  - [ ] 欄位防呆
  - [ ] 錯誤訊息包裝
  - [ ] 錯誤訊息: 重複鍵值 (公司名稱)

## Table Component
  - [x] search
  - [x] sort
  - [x] page
  - [X] text fields transform to multiline
  - [X] search detail
  - [ ] refine receipt detail as general methods
  
## Company Page
  - [X] Add 'Remark' Field
## Material Page
## Receipt Page
  - [ ] save undone receipt
  - [x] 2020/07/29 Date format change to string

## Bugs
  - [x] 2020/07/29 Material Page: result.data.length should bigger than 0 not bigger and equal
  - [x] 2020/07/29 Table Component: numeric can't display appropriately
  - [x] Receipt Page: there are not real-time items after modify an item
  - [x] Material Page: there was an error when company count is zero


# Log

2020/07/30
1. Add field 'NAME' to 'DB_INFO'
2. Create backup function
3. Create timer of auto backup 
4. Implement search the receipt detail
5. ReceiptPage: fix field 'receiptDate' bug

2020/07/29
1. fix Bug Table Component: numeric can't display appropriately
2. change date format to string
3. fix some bug

2020/07/24
1. Start this log