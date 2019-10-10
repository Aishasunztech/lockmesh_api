Short Document To Add New Column (for devices table to handle dropdown)
Exp Column: DEVICE ID 

FRONT-END
1: add object into columns array and dataindex attribute is compulsory, exp given below
2: defice column into dataSource of Table against "dataindex" name
3: add key, value object into initialSettings.js, there key is the name of dataindex that define into columns and value is the ID as CONSTANT that will define our text into "DeviceConstants.js" which we want to display.

BACK-END
4: also add key, value object into "Application.js", there key is the name of dataindex that define into columns and value is the ID that will define our text which we want to display.
5: add entry (text against defined id) into json file  for all languages

6: Run these URLs to update columns dropdown check for all costumers 
Local:
i- http://localhost:3000/users/update_device_columns
ii- http://localhost:3000/users/update_dealer_columns
iii- http://localhost:3000/users/update_sdealer_columns
iv- http://localhost:3000/users/update_apk_columns
	https://devapi.lockmesh.com
Dev:
 i- https://devapi.lockmesh.com/users/update_device_columns
ii- https://devapi.lockmesh.com/users/update_dealer_columns
iii- https://devapi.lockmesh.com/users/update_sdealer_columns
iv- https://devapi.lockmesh.com/users/update_apk_columns

Live:
i- https://api.lockmesh.com/users/update_device_columns
ii- https://api.lockmesh.com/users/update_dealer_columns
iii- https://api.lockmesh.com/users/update_sdealer_columns
iv- https://api.lockmesh.com/users/update_apk_columns


SAME PROCEDURE FOR OTHERS LIKE (APK, DEALERS, S-DEALERS, APK etc)
========================================================================
exp# 01: 
{
            title: (
                <Input.Search
                    name="device_id"
                    key="device_id"
                    id="device_id"
                    placeholder={convertToLang(translation[DEVICE_ID], "DEVICE ID")}
                />
            ),
            dataIndex: 'device_id' ,
           children: [],
 }

exp# 02: 
<Table
dataSource=[{device_id: "12345678"}]
/>
here device_id is dataindex name of column

exp# 03:
deviceColumns: [
    { "key": "device_id", "value": DEVICE_ID },
]

exp# 04:
deviceColumns: [
    { "key": "device_id", "value": "tableHeadings.DEVICEID" },
]
exp# 05:
root => languages => en.json
{
...
"tableHeadings.DEVICEID": "DEVICE ID",
...
}

************************** 	END **************************