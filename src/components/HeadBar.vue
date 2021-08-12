<template>
  <div id="head-bar">
    <!-- left contents: logo -->
    <router-link class="header-logo-link" to="/">
        <img class="header-logo" :alt="$t('flamesLogo')" src="../assets/Flames-logo-black.png">
    </router-link>
    <!-- center contents: logo -->
    <div class="header-link-container">
        <router-link class="header-link" to="/">
            <span>{{ $t('allOutfits') }}</span>
        </router-link>
        <router-link class="header-link" to="/occasions">
            <span>{{ $t('occasions') }}</span>
        </router-link>
        <router-link class="header-link" to="/styles">
            <span>{{ $t('styles') }}</span>
        </router-link>
    </div>
    <!-- right contents -->
    <!-- <div>

    </div>-->
  </div>
</template>

<script>

export default {
  name: 'HeadBar'
}
</script>

<style lang="scss">

    $mobileMaxWidth: 800px;

    $top: 50px;
    $height: 28px;
    $linkColor: rgb(22, 22, 22);

    #head-bar {
        overflow: hidden;
        position: relative;
        top: 0px;
        left: 0px;
        height: 120px;
        width: 100%;
        border-bottom: 3px solid #B3D1FF;

        a:link {
           text-decoration: none;
           color: $linkColor;
        }

        a:visited {
            text-decoration: none;
            color: $linkColor;
        }

        a:hover {
            text-decoration: none;
            color: $linkColor;
        }

        a:active {
            text-decoration: none;
            color: $linkColor;
        }

        .header-logo-link {
            height: $height;
            width: auto;
            position: absolute;
            top: $top;
            left: 90px;
        }
        @media screen and (max-width: $mobileMaxWidth) {
           .header-logo-link {
               position: absolute;
               width: 100%;
               left: 50%;
               transform: translate(-50%);
               text-align: center;
               top: 30px;
            }
        }

        .header-logo {
            overflow: hidden;
            height: $height;
            width: auto;
        }

        .header-link-container {
            width: 40%;
            height: $height;
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            top: $top;
            text-align: center;
            white-space: nowrap;
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .header-link-container {
                top: calc(30px + (28px * 2));
                width: 100%;
            }
        }

        .header-link {
            position: relative;
            top: 2px;
            margin: auto 10px;
            font-size: 1.1rem;
            font-weight: 500;

            span {
                width: 110px;
                text-align: center;
                display: inline-block;
            }
        }

         @media screen and (max-width: $mobileMaxWidth) {
            .header-link {

                span {
                    width: 80px;
                    text-align: center;
                    display: inline-block;
                }
            }
        }
    }
</style>
