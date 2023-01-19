<template>
  <main>

    <div class="rl-container mx-auto bg-white border-solid border border-gray-border-line inline-grid rounded-lg">
      <messageBox></messageBox>
      <div class="flex border-y border-gray-border-line p-4 mb-6 pr-8 border-t-0">
        <div class="flex-initial w-28 pl-8">
          <RouterLink :to="back">
            <button
                class="bg-white transition duration-300 hover:bg-purple-lite hover:text-white rounded-full px-3 py-3 text-center inline-flex items-center">
              <img :src="base+'/arrow-left.svg'" alt="Back">
            </button>
          </RouterLink>
        </div>
        <div class="flex mt-1">
          <div>


            <div class="inline-flex">
              <h1 class="font-medium text-base text-black-font">General Settings</h1>

                <div @click="doc" class="bg-purple-lite hover:bg-purple doc hover:doc-hover text-gray-font hover:text-white cursor-pointer leading-[15px] ml-2 text-xsss font-medium flex mb-1 transition duration-300 py-1 px-3 rounded-full">
                  <svg class="mr-2 mt-[3px]"  width="10" height="10" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.21141 1.59142C9.21141 0.80533 8.81769 0.268836 8.09434 0.0545106L8.0862 0.0524759C7.97565 0.0282535 7.86377 0.0105883 7.75114 -0.000427246H1.96062C1.28237 -0.000427246 0.982924 0.0965623 0.919169 0.12064L0.905603 0.126066C0.888986 0.132849 0.871689 0.140309 0.857107 0.148109C0.311458 0.416355 0.00930095 0.863659 0.00726621 1.47069C-0.00155099 4.28338 -0.0023446 7.09618 0.00489003 9.90909C0.00489003 10.6993 0.662113 11.3649 1.44854 11.37C2.77655 11.3785 4.10489 11.3724 5.4329 11.3724C5.44545 11.3724 5.45799 11.37 5.48716 11.367C5.52717 11.1527 5.56957 10.9349 5.60755 10.7162C5.66453 10.3927 5.82311 10.0957 6.06028 9.8684C7.0729 8.85917 8.08518 7.8496 9.09712 6.83969C9.13566 6.80535 9.16613 6.76292 9.18635 6.71543C9.20658 6.66795 9.21606 6.61658 9.21412 6.565C9.21005 4.90827 9.20915 3.25041 9.21141 1.59142ZM1.62929 2.67661C1.62896 2.6713 1.62896 2.66598 1.62929 2.66067C1.62929 2.65457 1.62929 2.64847 1.62929 2.64202C1.6291 2.63841 1.6291 2.63478 1.62929 2.63117C1.62929 2.62608 1.62929 2.62066 1.63167 2.61557C1.63404 2.61048 1.6337 2.60302 1.63506 2.59692C1.63641 2.59081 1.63879 2.57861 1.64082 2.56979C1.6451 2.55267 1.65031 2.53581 1.65642 2.51926C1.65947 2.51078 1.66286 2.5023 1.66625 2.49416C1.67553 2.47006 1.68688 2.4468 1.70017 2.42464C1.70898 2.4098 1.71873 2.39553 1.72933 2.38191L1.74561 2.36123C1.75621 2.34795 1.76753 2.33527 1.77952 2.32325C1.78529 2.31714 1.79207 2.31104 1.79851 2.30527L1.80631 2.29883C1.81377 2.29238 1.82124 2.28628 1.82904 2.28052C1.83684 2.27475 1.8504 2.26492 1.86295 2.25746C1.87765 2.2475 1.89294 2.23844 1.90873 2.23033C1.93073 2.21926 1.95338 2.20952 1.97655 2.20116L1.9986 2.1937L2.01725 2.18827C2.03149 2.18387 2.04607 2.18047 2.06099 2.17742C2.07399 2.17459 2.08712 2.17244 2.10033 2.17098C2.1048 2.17006 2.10934 2.16949 2.1139 2.16928C2.12187 2.16797 2.12991 2.16718 2.13798 2.16691C2.15267 2.16555 2.1676 2.16488 2.18274 2.16488C2.89241 2.16058 3.6022 2.16058 4.31209 2.16488C4.33203 2.16486 4.35195 2.16588 4.37178 2.16793C4.4098 2.17156 4.44739 2.17883 4.48403 2.18963L4.51048 2.19811C4.52782 2.20389 4.54481 2.21069 4.56135 2.21846C4.58565 2.22977 4.60911 2.2428 4.63155 2.25746C4.63901 2.26186 4.64613 2.26695 4.65325 2.27204L4.67089 2.2856C4.73621 2.33603 4.78886 2.40101 4.82465 2.47537C4.86044 2.54972 4.8784 2.6314 4.87708 2.71392C4.87402 3.01913 4.63223 3.24804 4.30565 3.24939C3.95059 3.25109 3.59587 3.24939 3.24081 3.24939C2.89422 3.24939 2.54798 3.24939 2.20139 3.24939C1.87414 3.24939 1.632 3.02082 1.62861 2.71527C1.62827 2.70272 1.62827 2.69052 1.62929 2.67831V2.67661ZM5.39661 7.18695C5.39044 7.21009 5.38262 7.23275 5.37321 7.25478C5.3705 7.26156 5.36745 7.268 5.3644 7.27444C5.36134 7.28089 5.35931 7.28496 5.3566 7.29005C5.35388 7.29513 5.35252 7.29852 5.35015 7.30259C5.32666 7.34533 5.2972 7.38449 5.26266 7.41891C5.25655 7.42502 5.25011 7.43078 5.24367 7.43655C5.23723 7.44231 5.23315 7.44604 5.22739 7.45045C5.22162 7.45486 5.20501 7.46842 5.19348 7.47656C5.17872 7.48685 5.16344 7.49635 5.14769 7.50505C5.13989 7.50946 5.13176 7.51353 5.12362 7.5176C5.11548 7.52167 5.09886 7.52947 5.08598 7.53455C5.07309 7.53964 5.05986 7.54473 5.0463 7.54913C5.03273 7.55354 5.00967 7.55999 4.99068 7.5644C4.98186 7.56643 4.97305 7.56847 4.96389 7.56982C4.95474 7.57118 4.94354 7.57321 4.93337 7.57457L4.91099 7.57728L4.89098 7.57898C4.87425 7.58033 4.85729 7.58101 4.84011 7.58101C3.9611 7.58327 3.08187 7.58327 2.20241 7.58101C2.19088 7.58101 2.17969 7.58101 2.1685 7.58101H2.15425L2.13255 7.57898L2.1139 7.5766L2.08779 7.57287C2.07626 7.5705 2.06473 7.56847 2.05387 7.56575C2.05275 7.56595 2.05161 7.56595 2.05048 7.56575C2.04323 7.56451 2.03609 7.56269 2.02912 7.56033C2.01872 7.55761 2.00854 7.55456 1.9986 7.55117C1.98865 7.54778 1.97735 7.54337 1.96468 7.53794C1.95282 7.5332 1.94129 7.52811 1.93077 7.52268C1.92026 7.51726 1.90839 7.51149 1.89686 7.50539C1.88533 7.49928 1.87583 7.49284 1.86566 7.48606C1.85957 7.4823 1.85369 7.47823 1.84803 7.47385L1.8331 7.463C1.83182 7.46217 1.83068 7.46113 1.82971 7.45995C1.82419 7.45618 1.81898 7.45199 1.81412 7.4474C1.80666 7.44129 1.79919 7.43485 1.79207 7.42807C1.7794 7.41596 1.7674 7.40317 1.75612 7.38975C1.73547 7.3658 1.71718 7.3399 1.70152 7.31243L1.69373 7.29886C1.68728 7.28699 1.68152 7.27512 1.67609 7.26291L1.67202 7.25308C1.66535 7.2376 1.65957 7.22175 1.65473 7.2056C1.65269 7.19916 1.65065 7.19272 1.6493 7.18627C1.64919 7.18469 1.64919 7.18311 1.6493 7.18153C1.6493 7.17847 1.6493 7.17542 1.64693 7.17203C1.64609 7.16902 1.64541 7.16596 1.64489 7.16287C1.64489 7.15711 1.64218 7.15168 1.64116 7.14558C1.64014 7.13947 1.64116 7.13947 1.64116 7.13642C1.64116 7.13337 1.64116 7.12557 1.63879 7.1198C1.63673 7.10632 1.63537 7.09274 1.63472 7.07911V7.06012C1.63472 7.05232 1.63472 7.04418 1.63472 7.03604C1.63472 7.0279 1.63472 7.01671 1.63472 7.00722C1.63472 6.99772 1.63472 6.99331 1.63472 6.98653C1.63472 6.97975 1.63709 6.96279 1.63913 6.95092C1.64116 6.93905 1.64218 6.93261 1.64421 6.92379C1.64625 6.91497 1.64726 6.90921 1.6493 6.90209C1.65133 6.89497 1.65201 6.89158 1.65371 6.88649C1.6554 6.8814 1.65778 6.87191 1.66049 6.86478C1.66162 6.86001 1.66321 6.85535 1.66524 6.85088C1.6676 6.84374 1.67032 6.83672 1.67338 6.82985C1.67609 6.82341 1.6788 6.81697 1.68186 6.81086C1.68651 6.80042 1.69172 6.79023 1.69746 6.78034C1.69968 6.77579 1.70217 6.77138 1.70491 6.76712C1.70865 6.76101 1.71238 6.75457 1.71645 6.74847C1.72052 6.74236 1.73171 6.72608 1.74019 6.71455C1.74866 6.70302 1.7524 6.69929 1.75884 6.69183C1.76528 6.68437 1.7724 6.67691 1.77919 6.66945C1.78597 6.66199 1.79444 6.65453 1.80258 6.64741L1.81819 6.63384C1.83185 6.62246 1.84611 6.61182 1.86091 6.60196C1.8677 6.59722 1.87482 6.59281 1.88194 6.58874C1.88906 6.58467 1.89788 6.5789 1.90602 6.57449C1.93068 6.5613 1.9563 6.54996 1.98266 6.54058C1.9891 6.53787 1.99554 6.53583 2.00199 6.5338L2.01047 6.53109C2.01788 6.52832 2.02547 6.52605 2.03319 6.5243C2.05082 6.51922 2.0671 6.51515 2.08711 6.51176L2.10135 6.50938C2.1139 6.50735 2.12645 6.50531 2.13933 6.5043C2.15222 6.50328 2.16409 6.50192 2.17664 6.50124H2.19359H2.21598C2.65141 6.50124 3.08685 6.50124 3.52228 6.50124C3.96201 6.50124 4.40174 6.50124 4.84147 6.50124C4.8574 6.50124 4.873 6.50124 4.88826 6.50124C4.89606 6.50124 4.90353 6.50124 4.91099 6.50328L4.93371 6.50565C4.95372 6.50803 4.97305 6.51176 4.99204 6.51583C5.01991 6.52212 5.04733 6.53028 5.07411 6.54024C5.0914 6.54669 5.10802 6.55381 5.12498 6.56195C5.14193 6.57009 5.15108 6.57551 5.16363 6.58297L5.18229 6.5945C5.18848 6.59826 5.19448 6.60233 5.20026 6.60671C5.20569 6.61044 5.21111 6.61417 5.2162 6.61824L5.22875 6.62808L5.23451 6.63282L5.25045 6.64673C5.25757 6.65283 5.26435 6.65962 5.2708 6.66606C5.29063 6.68612 5.30878 6.70779 5.32506 6.73083C5.33014 6.73795 5.33523 6.74541 5.33964 6.75287C5.35611 6.77892 5.36997 6.80652 5.38101 6.83528C5.38339 6.84138 5.3861 6.84783 5.38813 6.85427C5.39017 6.86071 5.39254 6.86682 5.39458 6.87326C5.39661 6.87971 5.39932 6.8892 5.40136 6.897C5.40631 6.91575 5.41016 6.93477 5.41289 6.95397C5.41289 6.96313 5.4156 6.97263 5.41628 6.98212C5.41628 7.00077 5.41899 7.0201 5.41899 7.03977C5.41906 7.07824 5.41542 7.11662 5.40814 7.1544C5.40238 7.16559 5.39966 7.17678 5.39661 7.18695ZM7.08477 5.40859C6.8779 5.41876 6.67036 5.41266 6.46315 5.41266H4.59798C4.13067 5.41266 3.66335 5.41266 3.19604 5.41266H3.1445C2.82527 5.41266 2.50615 5.41198 2.18715 5.41062C2.1671 5.41064 2.14707 5.40962 2.12713 5.40757C2.08895 5.40402 2.05123 5.39664 2.01453 5.38553C1.9794 5.37495 1.94534 5.3611 1.9128 5.34416C1.89686 5.33568 1.8816 5.32652 1.86668 5.31703C1.85176 5.30753 1.83785 5.29668 1.82395 5.28583C1.73975 5.2161 1.67886 5.12231 1.64944 5.01702C1.62002 4.91173 1.62346 4.79996 1.65931 4.69669C1.69516 4.59341 1.76171 4.50355 1.85004 4.43914C1.93838 4.37473 2.04428 4.33884 2.15357 4.33628C2.27837 4.33391 2.40351 4.33323 2.52865 4.33323C2.67854 4.33323 2.82843 4.33323 2.97798 4.33323H4.58712C5.39152 4.33323 6.19604 4.33323 7.00066 4.33323C7.3113 4.33323 7.52427 4.50279 7.57446 4.77985C7.58868 4.85401 7.58692 4.93035 7.56928 5.00377C7.55165 5.07719 7.51855 5.146 7.4722 5.2056C7.42585 5.26521 7.36731 5.31424 7.3005 5.34942C7.23369 5.3846 7.16014 5.40512 7.08477 5.40961V5.40859Z"/>
                    <path d="M12.9998 8.04767C12.9364 8.33728 12.7523 8.54517 12.5485 8.74796C11.3068 9.98305 10.0689 11.2216 8.83472 12.4637C8.69282 12.6144 8.50408 12.7125 8.29925 12.7422C7.82753 12.8154 7.35818 12.9032 6.88816 12.9863C6.57108 13.0419 6.34013 12.8147 6.39473 12.4943C6.48189 11.9818 6.57413 11.4704 6.66094 10.9584C6.68311 10.8287 6.74678 10.7097 6.84237 10.6192C8.148 9.31656 9.45306 8.01342 10.7576 6.70983C10.8702 6.59578 10.9981 6.49796 11.1377 6.4192C11.4477 6.24964 11.7709 6.2961 12.0272 6.53823C12.2731 6.77087 12.5207 7.00385 12.7394 7.25989C12.8554 7.39554 12.914 7.58002 12.9985 7.7428L12.9998 8.04767Z"/>
                    <path d="M5.37354 7.25716C5.38294 7.23513 5.39076 7.21247 5.39693 7.18933C5.39085 7.2125 5.38303 7.23517 5.37354 7.25716Z"/>
                    <path d="M5.4043 7.15302C5.41158 7.11525 5.41521 7.07686 5.41515 7.03839C5.41515 7.01872 5.41515 6.9994 5.41244 6.98074C5.41449 6.99989 5.41551 7.01914 5.41549 7.03839C5.41561 7.07688 5.41186 7.11528 5.4043 7.15302Z"/>
                  </svg>
                  Documentation
                </div>
            </div>
            <p class="text-sm text-gray-font">Set of options that applies for overall RapidLoad plugin</p>
          </div>
        </div>
      </div>



      <div>
        <div class="p-4 pl-32 pr-72">

          <div class="grid mb-5">
            <h1 class="font-normal text-base text-black-font">Exclude URLs</h1>
            <p class="text-sm pb-3 text-gray-font">URLs that needs to be excluded from the whole RapidLoad optimization</p>

                <textarea
                    v-model="uucss_excluded_links"
                    @focus="focus='exclude'" @blur="focus = null"
                    class="resize-none z-50 appearance-none border border-gray-button-border rounded-lg w-full py-2 px-3 h-20 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                    id="force-include" type="text" placeholder=""></textarea>
              <div :class="focus==='exclude'? 'bg-purple-lite':'bg-gray-lite-background'"
                   class="-mt-3  rounded-lg px-4 py-4 pb-2" role="alert">
                <p class="text-sm text-dark-gray-font">URL/s to be excluded one URL per line.</p>
              </div>

          </div>

          <div class="grid">
            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_query_string = !uucss_query_string" :class="uucss_query_string? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200 cursor-pointer">
                      <svg v-if="uucss_query_string" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 @click="uucss_query_string = !uucss_query_string" class="font-normal text-base text-black-font cursor-pointer">Query String</h1>
                  <p class="text-sm text-gray-font">Consider URLs with query strings as separate URLs.</p>
                </div>
              </div>
            </div>
          </div>


            <div class="mb-5">
              <div class="flex">
                <div class="pr-1">
                  <div class="flex items-center mr-4 mt-3">
                    <div @click="uucss_enable_debug = !uucss_enable_debug" :class="uucss_enable_debug? 'bg-purple':''"
                         class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200 cursor-pointer">
                      <svg v-if="uucss_enable_debug" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                           class="transform scale-125">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                      </svg>
                    </div>

                  </div>
                </div>
                <div>
                  <h1 @click="uucss_enable_debug = !uucss_enable_debug" class="font-normal text-base text-black-font cursor-pointer">Debug Mode</h1>
                  <p class="text-sm text-gray-font">Enable debug logs for RapidLoad. <RouterLink v-if="uucss_enable_debug" :to="debug_logs_settings"><span class="text-purple cursor-pointer">View logs</span></RouterLink></p>
                </div>
              </div>
            </div>


          <div class="flex mt-5 pb-1 transition duration-300 hover:cursor-pointer rounded" @click="queue_option.default=!queue_option.default">
            <div class="pr-1">
              <div class="flex items-center mr-4 mt-3">

                <svg class="ml-[-3px]" :class="{'advanced-after': queue_option.default , 'advanced-before' : !queue_option.default }" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.46967 5.46967C9.76256 5.17678 10.2374 5.17678 10.5303 5.46967L16.5303 11.4697C16.8232 11.7626 16.8232 12.2374 16.5303 12.5303L10.5303 18.5303C10.2374 18.8232 9.76256 18.8232 9.46967 18.5303C9.17678 18.2374 9.17678 17.7626 9.46967 17.4697L14.9393 12L9.46967 6.53033C9.17678 6.23744 9.17678 5.76256 9.46967 5.46967Z" fill="#030D45"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="font-normal text-base text-black-font">Queue options</h1>
              <p class="text-sm text-gray-font">More advanced options for pro users</p>
            </div>
          </div>

          <div :class="{ expand: queue_option.default}" class="mt-3 pl-6 not-expand main-border">

            <div class="flex">
              <div>
                <h1 class="font-normal text-base text-black-font">Queue</h1>
                <p class="text-sm text-gray-font pb-2">Count and time period to optimize URLs</p>
                <div class="flex">
                  <p class="text-sm text-gray-font pr-3 pt-1">Run</p>

                  <dropDown v-if="queue_option.uucss_jobs_per_queue"
                      :options="queue_jobs_options"
                      :default="queue_option.uucss_jobs_per_queue"
                      class="select mr-3"
                      @input="queue_option.uucss_jobs_per_queue=$event"
                  />
                  <p class="text-sm text-gray-font pr-3 pt-1">Per</p>
                  <dropDown v-if="queue_option.uucss_queue_interval"
                      :options="jobs_timing_options"
                      :default="queue_option.uucss_queue_interval"
                      class="select mr-3" style="min-width: 110px"
                      @input="queue_option.uucss_queue_interval=$event"
                  />
                </div>
              </div>
            </div>
            <div class="flex mt-5">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <div @click="queue_option.uucss_disable_add_to_queue = !queue_option.uucss_disable_add_to_queue" :class="queue_option.uucss_disable_add_to_queue? 'bg-purple':''"
                       class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200 cursor-pointer">
                    <svg v-if="queue_option.uucss_disable_add_to_queue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                         class="transform scale-125">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                    </svg>
                  </div>

                </div>
              </div>
              <div>
                <h1 @click="queue_option.uucss_disable_add_to_queue = !queue_option.uucss_disable_add_to_queue" class="font-normal text-base text-black-font cursor-pointer">Disable Auto Queue</h1>
                <p class="text-sm text-gray-font">Disable jobs adding to queue on user visits.</p>
              </div>
            </div>
            <div class="flex mt-5 mb-2">
              <div class="pr-1">
                <div class="flex items-center mr-4 mt-3">
                  <div @click="queue_option.uucss_disable_add_to_re_queue = !queue_option.uucss_disable_add_to_re_queue" :class="queue_option.uucss_disable_add_to_re_queue? 'bg-purple':''"
                       class="border-purple border-2 rounded p-1 w-5 h-5 transition-all duration-200 cursor-pointer">
                    <svg v-if="queue_option.uucss_disable_add_to_re_queue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                         class="transform scale-125">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                    </svg>
                  </div>

                </div>
              </div>
              <div>
                <h1 @click="queue_option.uucss_disable_add_to_re_queue = !queue_option.uucss_disable_add_to_re_queue" class="font-normal text-base text-black-font cursor-pointer">Disable Re-Queue</h1>
                <p class="text-sm text-gray-font">Disable jobs re-queuing on warnings.</p>
              </div>
            </div>
          </div>


          <div class="flex mt-2 pb-1 transition duration-300 hover:cursor-pointer rounded" @click="saveRuleBased">
            <div class="pr-1">
              <div class="flex items-center mr-4 mt-3">

                <svg class="ml-[-3px]" :class="{'advanced-after': misc_option , 'advanced-before' : !misc_option }" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.46967 5.46967C9.76256 5.17678 10.2374 5.17678 10.5303 5.46967L16.5303 11.4697C16.8232 11.7626 16.8232 12.2374 16.5303 12.5303L10.5303 18.5303C10.2374 18.8232 9.76256 18.8232 9.46967 18.5303C9.17678 18.2374 9.17678 17.7626 9.46967 17.4697L14.9393 12L9.46967 6.53033C9.17678 6.23744 9.17678 5.76256 9.46967 5.46967Z" fill="#030D45"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="font-normal text-base text-black-font">Misc options</h1>
              <p class="text-sm text-gray-font">More advanced options for pro users</p>
            </div>
          </div>

          <div :class="{ expand: misc_option}" class="mt-3 pl-6 not-expand main-border">
              <div class="">
                <button @click="ruleSettings"
                        class="bg-transparent mb-3 mt-2 text-black-font transition duration-300 hover:bg-purple font-semibold hover:text-white py-2 px-4 border border-gray-button-border hover:border-transparent rounded-lg">
                  Settings
                </button>
              </div>
          </div>

          <button @click="saveSettings" :disabled="loading" :class="saved? 'pointer-events-none': ''"
                  class="disabled:opacity-50 flex mb-3 cursor-pointer transition duration-300 bg-purple font-semibold text-white py-2 px-4 border border-purple hover:border-transparent mt-5 rounded-lg">
            <svg :class="loading? 'block' : 'hidden'" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg :class="saved ? 'block' : 'hidden'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                 class="transform scale-125 w-5 h-3.5 mt-1 mr-3 -ml-1">
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
            </svg>

            Save Settings
          </button>

        </div>
      </div>
      <div class="pb-6">
      </div>
    </div>

  </main>

</template>

<script>
import config from "../../config";
import Vue3TagsInput from 'vue3-tags-input';
import dropDown from '../../components/dropDown.vue'
import messageBox from "../../components/messageBox.vue";
import axios from "axios";

export default {
  name: "general-settings",

  components: {
    Vue3TagsInput,
    dropDown,
    messageBox,
  },

  mounted() {

    const activeModules = [];
    Object.keys(window.uucss_global.active_modules).forEach((a) => {
      activeModules.push(window.uucss_global.active_modules[a])
    });
    this.general_config = activeModules;

    if (this.general_config) {
      Object.keys(this.general_config).map((key) => {
        if (this.id === this.general_config[key].id) {
          const option = this.general_config[key].options;

          this.queue_option.uucss_disable_add_to_queue = option.uucss_disable_add_to_queue;
          this.queue_option.uucss_disable_add_to_re_queue = option.uucss_disable_add_to_re_queue;
          this.uucss_enable_debug = option.uucss_enable_debug;
          this.uucss_excluded_links = option.uucss_excluded_links?.replace(/,/g, '\n');
          this.uucss_query_string = option.uucss_query_string;
          this.queue_option.uucss_jobs_per_queue = option.uucss_jobs_per_queue < 2 ? option.uucss_jobs_per_queue + " Job" : option.uucss_jobs_per_queue + " Jobs";
          this.queue_option.uucss_queue_interval = option.uucss_queue_interval > 5999 ? option.uucss_queue_interval / 6000 + " Hour" : option.uucss_queue_interval < 61 ? option.uucss_queue_interval / 60 + " Minute" : option.uucss_queue_interval / 60 + " Minutes";


        }

      });
    }
  },

  methods:{
    saveRuleBased() {
      this.misc_option=!this.misc_option;
      const data = {
        uucss_enable_rules: this.misc_option,

      }
      axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {

            response.data;
            window.uucss_global.active_modules = response.data.data;

          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });

    },
    ruleSettings() {
      window.location.href = window.uucss_global.setting_url+'&dev_mode';
    },
    doc(){
      window.open('https://docs.rapidload.io/features/general-settings', '_blank');
    },
    dataSaved(){
      this.saved = true;
      setTimeout(() => this.saved = false, 2000)
    },

    getLog(){
      axios.get(window.uucss_global.ajax_url + '?action=uucss_logs')
          .then(response => {
            this.debug_log = response.data.data;

          })
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
    },
    saveSettings(){
      this.loading = true;
      const data = {
        uucss_enable_debug : this.uucss_enable_debug,
        uucss_query_string : this.uucss_query_string,
        uucss_excluded_links : this.uucss_excluded_links?.replace(/\n/g, ","),
        uucss_jobs_per_queue : this.queue_option.uucss_jobs_per_queue?.replace(/\D/g,''),
        uucss_queue_interval : this.queue_option.uucss_queue_interval === '1 Hour' ? this.queue_option.uucss_queue_interval.replace(/\D/g,'')*6000 : this.queue_option.uucss_queue_interval.replace(/\D/g,'')*60,
        uucss_disable_add_to_queue : this.queue_option.uucss_disable_add_to_queue,
        uucss_disable_add_to_re_queue : this.queue_option.uucss_disable_add_to_re_queue,
      }
      axios.post(window.uucss_global.ajax_url + '?action=update_rapidload_settings' , data,{
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
          .then(response => {
            response.data;
            window.uucss_global.active_modules = response.data.data;
          } )
          .catch(error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          }).finally(()=>{
              this.loading = false;
              this.dataSaved();
          });

    }
  },

  data() {
    return {
      general_config:[],
      id: 'general',
      base: config.is_plugin ? config.public_base + 'images/' : 'public/images/',
      focus: null,
      saved: false,
      back: '/',
      loading : false,
      debug_logs_settings: '/debug-logs',
      uucss_enable_debug: false,
      uucss_query_string: false,
      uucss_excluded_links: [],
      queue_jobs_options: ['1 Job', '2 Jobs', '4 Jobs', '8 Jobs', '16 Jobs'],
      jobs_timing_options: ['1 Minute', '5 Minutes', '10 Minutes', '30 Minutes', '1 Hour'],
      debug_log: null,
      misc_option: false,
      queue_option: {
        default: false,
        queue: false,
        uucss_disable_add_to_queue: false,
        uucss_disable_add_to_re_queue: false,
        uucss_jobs_per_queue:'',
        uucss_queue_interval:'',
        test: 4 +" test",
      },


    }
  },


}
</script>

<style scoped>

</style>