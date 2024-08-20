import React, { useEffect, useState } from "react";


interface Props {
    title:  string;
    totalItems:Array;
    selected:Array;
    multipleSelection:boolean;
  }

const Setup: React.FC<Props> =({title,totalItems,selected,multipleSelection})=> {
  const [totalList, setTotalList] = useState(totalItems||[]);
  const [list, setList] = useState(totalList);
  const [selectedList, setSelectedList] = useState(selected||[]);

  const changeList = (val) => {
    const arr = [...selectedList];
    const result = arr.find((item) => item === val);
if(multipleSelection){
    if (result) {
        const newArray = arr.filter((element) => element !== val);
        setSelectedList(newArray);
      } else {
        arr.push(val);
        setSelectedList(arr);
      }
}else{
    setSelectedList([val]);
}

    
  };




  const changeLis = (val, ind) => {
    const arr = [...filteredList];
    const obj = arr[ind];
    const result = obj.selectedItems.find((item) => item === val);
    if (obj.multipleSelection) {
      if (result) {
        const newArray = obj.selectedItems.filter((element) => element !== val);
        obj.selectedItems = newArray;
      } else {
        obj.selectedItems.push(val);
      }
    } else {
      obj.selectedItems = [val];
    }
    setFilteredList(arr);
  };




  const filterList = (e) => {
    let newList = [...totalList];
    let filteredList = newList.filter((item) =>
      item.includes(e.target.value.toLowerCase())
    );
    setList(filteredList);
  };
  const pascle = (string) => {
    const arr = string.split("");
    arr[0] = arr[0].toUpperCase();
    return arr.join("");
  };
  return (
    <div className="setuppage">
      <h2>{title?title:'Tittle'}</h2>


      <input type="text" placeholder="Search" onChange={filterList} />
      <div className="setupContainer">

{
    list&&list.map((i,k)=>{
        return(
            <div>
<h4 style={{
    marginTop:'10px'
}}>{i.title}</h4>
<div>
    {
        i.items.map(x=>{
            const check = i.selectedItems.find((item) => item === x);
            return (
                <span
                style={{
                    background: check ? "#9500CA" : "",
                    color: check ? "white" : "",
                  }}
                  onClick={() => changeList(x)}
                >
                  {pascle(x)}
                </span>
              );
        })
    }
</div>
            </div>
            
        )
    })
}


        {/* {list &&
          list.map((i) => {
            const check = selectedList.find((item) => item === i);
            return (
              <span
                style={{
                  background: check ? "#9500CA" : "",
                  color: check ? "white" : "",
                }}
                onClick={() => changeList(i)}
              >
                {pascle(i)}
              </span>
            );
          })} */}
      </div>
      <button>Continue</button>
    </div>
  );
};

export default Setup;
