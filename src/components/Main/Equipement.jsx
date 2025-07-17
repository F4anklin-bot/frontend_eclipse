export default function Equipement({isLight}){



    return(
        <div className={`flex-1 flex flex-col ${isLight
            ? "text-black"
            : "text-white"
        }`}>

        </div>
    )
}