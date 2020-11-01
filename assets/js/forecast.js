function convert (unixTimeStamp){
    let unixTime = unixTimeStamp;
    //honapok
    let months_arr = ["Január","Február","Március","Április","Május","Június","Július","Szeptember","Október","November","December"];
    //Unix idő bélyeg miliszekundummá alakítása
    let date = new Date(unixTime*1000);
    //Dátum vissza nyerése a get segítségével
    let years = date.getFullYear();
    //hónapok vissza adása: jelenlegi hónap száma - 1
    let month = months_arr[date.getMonth()-1];
    let days = date.getDate();
    // Dátum összefűzés
    let convData = years+' '+month+' '+days+':';
    return convData;
};
function hourConvert (unixTimeStamp){
    let unixTime = unixTimeStamp;
    let date = new Date(unixTime*1000);
    /*Órák és percek kinyerése*/ 
    let h = date.getHours();
    let m = date.getMinutes();
    // Dátum összefűzés
    let convData = h+':'+m+'0';
    return convData;
};
function procenter(percent){
    let procent = percent;
    let end = percent* 100;
    return end.toFixed(0);
};
function windDegree(degRee){

    if(11.25 <= degRee && degRee <= 33.74){
        degRee = "Észak-északkelet";
        return degRee;
    }else if(33.75 <= degRee && degRee <= 56.24){
        degRee = "Észak-kelet";
        return degRee;
    }else if(56.25 <= degRee && degRee <= 78.74){
        degRee = "Kelet-északkelet";
        return degRee;
    }else if(78.75 <= degRee && degRee <= 101.24){
        degRee = "Kelet";
        return degRee;
    }else if(101.25 <= degRee && degRee <= 123.74){
        degRee = "Kelet-délkelet"
        return degRee;
    }else if(123.75 <= degRee && degRee <= 146.24){
        degRee = "Dél-kelet";
        return degRee;
    }else if(146.25 <= degRee && degRee <= 168.74){
        degRee = "Dél-délkelet";
        return degRee;
    }else if(168.75 <= degRee && degRee <= 191.24){
        degRee = "Dél";
        return degRee;
    }else if(191.25 <= degRee && degRee <= 213.74){
        degRee = "Dél-délnyugat";
        return degRee;
    }else if(213.75 <= degRee && degRee <= 236.24){
        degRee = "Dél-nyugat";
        return degRee;
    }else if(236.25 <= degRee && degRee <= 258.74){
        degRee = "Nyugat-délnyugat";
        return degRee;
    }else if(258.75 <= degRee && degRee <= 281.24){
        degRee = "Nyugat";
        return degRee;
    }else if(281.25 <= degRee && degRee <= 303.74){
        degRee = "Nyugat-északnyugat";
        return degRee;
    }else if(303.75 <= degRee && degRee <= 326.24){
        degRee = "Észak-nyugat";
        return degRee;
    }else if(326.25 <= degRee && degRee <= 348.74){
        degRee = "Észak-északnyugat";
        return degRee;
    }else{
        degRee = "Észak";
        return degRee;
    };
}
function weatherCondition(id, cssSelector, c= conditions) {
    /*meglévő időjárás állapot törlése */
    const $element = document.querySelector(`${cssSelector}`);
    for (let condition of c) {
      $element.classList.remove(condition);
    }
    /*Új állapot megnézése hozzáadása*/
    if (id >= 200 && id <= 232) {
        $element.classList.add(c[0]);
    } else if (id >= 300 && id <= 321) {
        $element.classList.add(c[1]);
    } else if (id >= 500 && id <= 531) {
        $element.classList.add(c[2]);
    } else if (id >= 600 && id <= 622) {
        $element.classList.add(c[3]);
    } else if (id >= 701 && id <= 781) {
        $element.classList.add(c[4]);
    } else if (id == 800) {
        $element.classList.add(c[5]);
    }  else if (id == 000) {
        $element.classList.add(c[7]);
    }  else {
        $element.classList.add(c[6]);
    }
  }
let conditions = ["thunder", "drizzle","rainy", "snowy","athmosphere","sunny","cloudy","error"];
let cityName= '';
let weather= {};
let alerts = {};
let alertStart = 0;
let alertEnd = 0;
let days;
let hours;
let weatherId;
const apiKey = "433675f8a176f2a9b6abb936e6dda3e7";

/* alapvető submit megakadályozása */
document.querySelector("form").addEventListener("submit", (event) =>{
    event.preventDefault();
    const city = document.querySelector('[name=city]').value;
    //felesleges space karakter eltávolítás
    city.trim();
    /*Első fetch*/ 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then( (result) => result.json())
    .then(function(data){
        /*A fetch adatainak kinyerése és átadása a másik fetch részére*/ 
        var cityLon = data.coord.lon;
        var cityLat = data.coord.lat;
        /* Város név vissza adása*/
        cityName = data.name;
        /*Második fetch*/
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=metric&lang=hu&appid=${apiKey}`)
    })
    /* A második fetch által kapott bővebb adatok átalakítása */
    .then( (endResults) => endResults.json())
    .then( function(datas){
        //debugger;
        //főbb változók feltöltése
        forecast = datas;
        weather = forecast.current.weather[0];
        days = forecast.daily;
        hours = forecast.hourly;
        /*rain = forecast.current.rain.current.rain.1h;
        snow = forecast.current.snow.current.snow.1h;*/
        if (typeof(forecast.alerts) == "undefined"){
            alerts = {
                "event" : "Nincs érvényben riasztás!",
            }
        } else {
             alerts = forecast.alerts[0];
        }; 
        
        let markup =  `
            <div class="container">
                <div class="title">
                    <h1>${cityName} időjárása a mai napon (${convert(forecast.current.dt)})</h1> 
                    <h2>Jelenleg: ${weather.description} </h2>
                </div>
                <div class="content">
                    <div class= "today">
                        <div class="ico">
                            <img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" />
                            <h2>${forecast.current.temp} °C / ${forecast.current.feels_like}°C</h2>
                            <p> Hőmérséklet / hőérzet </p>
                        </div>
                        <div class="wind">
                            <p>A jelenlegi szélsebesség: ${forecast.current.wind_speed} km/h / ${windDegree(forecast.current.wind_deg)}</p>
                        </div>
                        <div class="precipitation"> 
                            <p>időzóna: ${forecast.timezone}</p>
                            <p>A következő órában a csapadék esélye: ${procenter(forecast.hourly[1].pop)}%<p>
                            <p>A Páratartalom jelenleg: ${forecast.current.humidity}% </p>
                        </div>
                        <div class="alert">
                            <h2>Riasztások a mainapra:</h2>
                            <p>${alerts.event}</p>
                            <p>Kiadva: ${convert(alerts.start)}</p>
                            <p>Eddig: ${convert(alerts.end)}</p> 
                            <p>Kiadta : ${alerts.sender_name} </p>
                        </div>
                    </div>
                    
                    <div class="hours"> </div>
                </div>
                <h2>Távolabbi előrejelzések:</h2>
            </div>
        `
        //Jelenlegi időjárás
        document.querySelector(".js-now").innerHTML = markup;
        //oldal tartalom generálás
        for(let i = 0; i< 10; i++){
            let div = document.createElement('div');
            div.innerHTML = `
                <h4>Következő órákban:</h4>
                <h5> ${hourConvert(hours[i].dt)} </h5>
                <img src="http://openweathermap.org/img/wn/${hours[i].weather[0].icon}@2x.png" />
                <h5>${hours[i].temp}°C</h5>
                <p>Páratartalom: ${hours[i].humidity}%</p>
                <p>Szélsebesség: ${hours[i].wind_speed}</p>
                <p>Csapadék esélye: ${procenter(hours[i].pop)}%</p>
            `;
            div.classList.add("hourly" ,`hour${i}`);
            document.querySelector(".hours").appendChild(div);
        };
        //css hozzá rendelés
        weatherCondition(weather.id, ".wrapper")
        
        //előrejelzések:
        for (let i = 0; i < days.length; i++){
            
            let div = document.createElement('div');
            div.innerHTML = `
            
            <h4> ${convert(days[i].dt)} az időjárás várhatóan: ${days[i].weather[0].main}</h4>
            <div class="ico">
                <img src="http://openweathermap.org/img/wn/${days[i].weather[0].icon}@2x.png"/>
                <p>A várható hőmérséklet: ${days[i].temp.min}°C és ${days[i].temp.max} között várható. </p>
            </div>
            <div class="dayWind">
                <p>A várható szél sebesség: ${days[i].wind_speed}km/h és iránya: ${windDegree(days[i].wind_deg)}<p>
                <p>Esélye a csapadéknak: ${procenter(days[i].pop)} % </p>
                <p>A páratartalom ${days[i].humidity}% körül várható</p>
            </div>
            `;
            div.classList.add("days" ,`day${i}`);
            document.querySelector(".js-days").appendChild(div);
            weatherCondition(days[i].weather[0].id, `.day${i}`)
        };

      /*   CSS hozzárendelés */
      
      if(alerts.event == "Nincs érvényben riasztás!"){
            document.querySelector(".alert").classList.add("none")
        }
    })
    .catch(function (error) {
        let markup;
        let moreDay = "---";
        if (error == "TypeError: Cannot read property 'lon' of undefined"){
            markup = `
                <h1>Hoppá! A város nevét rosszul adtad meg! probáld újra!</h1>
                <p>A hiba oka: ${error}</p>
            `;
            document.querySelector(".js-now").innerHTML = markup;
            document.querySelector(".js-days").innerHTML = moreDay;
            weatherCondition(000, `.wrapper`);
            weatherCondition(000, `.days`);
        }else{
            markup =`<h1>Hoppá! Váratlan hiba!</h1> <p>késöbb probáld újra!</p><p>A hiba oka: ${error}</p>`;
            document.querySelector(".js-now").innerHTML = markup;
            document.querySelector(".js-days").innerHTML = moreDay;
            weatherCondition(000, `.wrapper`);
            weatherCondition(000, `.days`);
        };
        
      });
});
