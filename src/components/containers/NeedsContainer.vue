<template>
  <div id="needs-container">
    <div class="needs-subcontainer">
        <div class="needs-title">
            <h2>{{ $t('startFromWhatYouNeed') }}</h2>
        </div>
        <div class="needs-options-container">
            <div class="needs-options">
                <router-link class="header-logo-link" to="/occasions">
                    <div class="need-option">
                        <div class="need-image">
                            <img :alt="$t('occasions')" src="../../assets/occasions-image.png" />
                            <h3 class="need-title" >{{ $t('occasions') }}</h3>
                        </div>
                        <div class="need-description">
                            <p>{{ $t('findTheRightOutfit') }}</p>
                        </div>
                    </div>
                </router-link>
                <router-link class="header-logo-link" to="/styles">
                    <div class="need-option">
                        <div class="need-image">
                            <img :alt="$t('occasions')" src="../../assets/styles-image.png" />
                            <h3 class="need-title" >{{ $t('styles') }}</h3>
                        </div>
                        <div class="need-description">
                            <p>{{ $t('casualFormalOrSporty') }}</p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NeedsContainer'
}
</script>

<style lang="scss">

    $mobileMaxWidth: 800px;

    $needWidth: 280px;
    $needMargin: 0 auto 0 auto;
    $needImageRadius: 10px;
    $linkColor: black;

    #needs-container {
        overflow: hidden;
        position: relative;
        top: 0px;
        left: 0px;
        height: 730px;
        width: 100%;
        @media screen and (max-width: $mobileMaxWidth) {
            height: 1060px;
        }

        .needs-subcontainer {
            margin: 70px 105px 35px 105px;
            height: calc(100% - (70px + 35px));
            display: flex;
            flex-direction: column;
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .needs-subcontainer {
                margin: 40px 10px 15px 10px;
                height: calc(100% - (40px + 15px));
                display: inline-block;
                width: calc(100% - (10px * 2));
            }
        }

        .needs-title {
            font-size: 1.2rem;
        }

        .needs-options-container {
            background-color: #F5F5F5;
            border-radius: 5px;
            flex-grow: 1;
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .needs-options-container{
                background-color: white;
                width: 100%;
                height: fit-content;
            }
        }

        .needs-options {
            position: relative;
            margin: 60px 0 60px 0;
            width: 70%;
            left: 50%;
            transform: translate(-50%);
            height: calc(100% - (60px * 2));
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
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .needs-options {
                width: 80%;
                margin: 20px 0 20px 0;
            }
        }

        .need-option {
            width: calc(50% - (10px * 2));
            height: 100%;
            float: left;
            margin: 0 10px 20px 10px;
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .need-option {
                width: calc(100% - (10px * 2));
                height: 50%;
            }
        }

        .need-image {
            border-radius: $needImageRadius;
            margin: $needMargin;
            max-width: $needWidth;
            height: auto;

            img {
                max-width: 100%;
                height: auto;
                border-radius: $needImageRadius;
                box-shadow: 3px 3px 5px #2b2b2b40;
            }
        }

        .need-title {
            position: relative;
            margin: 0;
            width: 90%;
            top: -60px;
            left: 50%;
            transform: translate(-50%);
            font-size: 1.6rem;
            font-weight: 400;
            color: white;
            text-align: center;
        }

        .need-description {
            margin: $needMargin;
            max-width: $needWidth;
            position: relative;
            top: -25px;
            text-align: center;
            font-size: 1.1rem;
            font-weight: 500;
            p {
                padding: 0 30px 0 30px;
            }
        }
        @media screen and (max-width: $mobileMaxWidth) {
            .need-description {
                
                p {
                    padding: 0 15px 0 15px;
                }
            }
        }
    }
</style>
