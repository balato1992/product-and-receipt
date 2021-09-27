
# TODO

- [ ] auto complete of Material Page
- [x] add license
- [x] backup database
- [ ] icon of sorting display incorrectly, and sorting didn't work properly
- [ ] check database connection at beginning
  
- [ ] BUG 2020/07/31 Table Component: autocomplete clear will generate null value which is not valid for db
- [ ] Receipt Page: save undone receipt
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

## Material Page and Receipt Page

- [x] 2020/07/29 Date format change to string
- [x] 2020/07/31 Autocomplete of Receipt ProductName
- [x] 2020/07/31 list of all productNames

## Bugs

- [x] 2020/07/29 Material Page: result.data.length should bigger than 0 not bigger and equal
- [x] 2020/07/29 Table Component: numeric can't display appropriately
- [x] Receipt Page: there are not real-time items after modify an item
- [x] Material Page: there was an error when company count is zero

# Log

2021/09/27

1. Add manual backup and some settings
2. Material page and DB add image field

2020/08/29 v1.0.1

1. fix bug that won't insert backup time
2. update version

2020/07/31

1. Implement autocomplete of Receipt ProductName
2. Implement list of all productNames

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
